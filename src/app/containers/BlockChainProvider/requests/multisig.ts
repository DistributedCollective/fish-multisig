import { network } from '../network';
import { store } from '../../../../store/store';
import { toChecksumAddress } from '../../../../utils/helpers';
import { ContractName } from '../types';

export function multisign_submitTransaction(
  contractName: ContractName,
  destination: string,
  value: string,
  data: string,
) {
  const account = store.getState().blockChainProvider.address;
  console.log('submit tx', contractName, destination, value, data);
  return network.send(
    contractName,
    'submitTransaction',
    [toChecksumAddress(destination), value, data, { from: account }],
    {
      type: 'submitTransaction',
    },
  );
}

export function multisign_confirmTransaction(
  contractName: ContractName,
  transactionId: string,
) {
  const account = store.getState().blockChainProvider.address;
  return network.send(
    contractName,
    'confirmTransaction',
    [transactionId, { from: account }],
    {
      type: 'confirmTransaction',
    },
  );
}
