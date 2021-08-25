import { network } from '../network';
import { store } from '../../../../store/store';
import { toChecksumAddress } from '../../../../utils/helpers';

export function tokenMultisign_submitTransaction(
  destination: string,
  value: string,
  data: string,
) {
  const account = store.getState().blockChainProvider.address;
  return network.send(
    'multiSigToken',
    'submitTransaction',
    [toChecksumAddress(destination), value, data, { from: account }],
    {
      type: 'submitTransaction',
    },
  );
}

export function multisign_confirmTransaction(transactionId: string) {
  const account = store.getState().blockChainProvider.address;
  return network.send(
    'multiSigToken',
    'confirmTransaction',
    [transactionId, { from: account }],
    {
      type: 'confirmTransaction',
    },
  );
}
