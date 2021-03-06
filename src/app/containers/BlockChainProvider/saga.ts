import {
  call,
  put,
  takeLatest,
  takeEvery,
  take,
  select,
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import BlockTracker from 'eth-block-tracker-es5';
import { actions } from './slice';
import Web3 from 'web3';
import { network } from './network';
import { PayloadAction } from '@reduxjs/toolkit';
import { ChainId } from './types';
import { rpcNodes, wsNodes } from './classifiers';
import { walletConnection } from './web3-modal';
import { selectBlockChainProvider } from './selectors';
import { TransactionReceipt } from 'web3-core';
import { getNetwork } from '../../../utils/helpers';

function* setupSaga() {
  walletConnection.init();
  yield put(actions.setupCompleted());
}

function* networkSaga({
  payload,
}: PayloadAction<{ chainId: ChainId; networkId: number }>) {
  const nodeUrl = rpcNodes[payload.chainId];
  let web3Provider;
  let isWebsocket = false;
  if (nodeUrl.startsWith('http')) {
    web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
      keepAlive: true,
    });
  } else {
    web3Provider = new Web3.providers.WebsocketProvider(nodeUrl, {
      timeout: 5,
      reconnectDelay: 10,
    });
    isWebsocket = true;
  }
  const web3 = new Web3(web3Provider);

  network.setWeb3(web3, getNetwork(payload.chainId), isWebsocket);
  network.setWsWeb3(
    new Web3(
      new Web3.providers.WebsocketProvider(wsNodes[payload.chainId], {
        timeout: 5,
        reconnectDelay: 10,
      }),
    ),
    getNetwork(payload.chainId),
  );
  yield put(actions.setupCompleted());
}

function* connectedSaga({ payload }: PayloadAction<{ address: string }>) {
  yield put(actions.accountChanged(payload.address));
}

function* disconnectSaga() {
  yield call([walletConnection, walletConnection.disconnect]);
}

// start block watcher
function createBlockPollChannel({ interval, web3 }) {
  return eventChannel(emit => {
    web3.currentProvider.sendAsync = web3.currentProvider.send;
    const blockTracker = new BlockTracker({
      provider: web3.currentProvider,
      pollingInterval: interval,
    });

    blockTracker.on('block', block => {
      emit(actions.blockReceived(block));
      emit(actions.processBlock(block));
    });

    blockTracker.start().catch(error => {
      emit(actions.blockFailed(error.message));
      emit(END);
    });

    return () => {
      blockTracker.stop().catch(_ => {
        // BlockTracker assumes there is an outstanding event subscription.
        // However for our tests we start and stop a BlockTracker in succession
        // that triggers an error.
      });
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* callCreateBlockPollChannel() {
  const web3 = network.web3;
  const blockChannel = yield call(createBlockPollChannel, {
    web3,
    interval: 10000,
  });

  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function* processBlock({ payload }: PayloadAction<any>) {
  const block = payload;
  try {
    const { address, transactionStack } = yield select(
      selectBlockChainProvider,
    );

    const txs = block.transactions;
    let hasChanges = false;

    if (txs.length > 0) {
      for (let i = 0; i < txs.length; i++) {
        const from = (txs[i].from || '').toLowerCase();
        const to = (txs[i].to || '').toLowerCase();
        const hash: string = txs[i].hash || '';

        if (transactionStack.includes(hash)) {
          const receipt: TransactionReceipt = yield call(
            network.web3.eth.getTransactionReceipt,
            hash,
          );
          if (receipt?.status) {
            hasChanges = true;
          }
          yield put(
            actions.updateTransactionStatus({
              transactionHash: hash,
              status: receipt.status ? 'confirmed' : 'failed',
            }),
          );
        }

        const hasContract = Object.values(network.contracts).find(contract => {
          const address = (contract as any).options.address.toLowerCase();
          return address === from || address === to;
        });

        if (hasContract) {
          hasChanges = true;
        }

        if (
          address &&
          (address.toLowerCase() === from || address.toLowerCase() === from)
        ) {
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      yield put(actions.reSync(block.number));
    }
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
    // yield put({ type: 'BLOCK_FAILED', error });
  }
}

function createBlockChannels({ web3 }) {
  return eventChannel(emit => {
    const blockEvents = web3.eth
      .subscribe('newBlockHeaders', (error, result) => {
        if (error) {
          emit(actions.blockFailed(error.message));

          console.error('Error in block header subscription:');
          console.error(error);

          emit(END);
        }
      })
      .on('data', blockHeader => {
        emit(actions.blockReceived(blockHeader));
        // emit({
        //   type: 'BLOCK_RECEIVED',
        //   blockHeader,
        //   web3,
        //   syncAlways,
        // });
      })
      .on('error', error => {
        emit(actions.blockFailed(error.message));
        // emit({ type: 'BLOCKS_FAILED', error });
        emit(END);
      });

    return () => {
      blockEvents.off();
    };
  });
}

// todo: for webscoket connection only
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* callCreateBlockChannels() {
  const web3 = network.web3;
  const blockChannel = yield call(createBlockChannels, { web3 });

  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function* processBlockHeader(event) {
  const blockNumber = Number(event.payload.number);
  const web3 = network.web3;
  try {
    const block = yield call(web3.eth.getBlock, blockNumber, true);
    yield call(processBlock, {
      type: actions.processBlock.type,
      payload: block,
    });
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
  }
}

// end block watcher

export function* blockChainProviderSaga() {
  yield takeLatest(actions.setup.type, setupSaga);
  yield takeLatest(actions.chainChanged.type, networkSaga);
  yield takeLatest(actions.connected.type, connectedSaga);
  // yield takeLatest(actions.connected.type, callCreateBlockChannels); // for ws
  yield takeLatest(actions.connected.type, callCreateBlockPollChannel); // for rpc
  yield takeEvery(actions.blockReceived.type, processBlockHeader);
  yield takeLatest(actions.disconnect.type, disconnectSaga);
  // yield takeEvery(actions.processBlock.type, processBlock); // when using poll channel
}
