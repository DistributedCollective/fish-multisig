import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiSigTransactionForm } from '../MultiSigTransactionForm';
import { MultiSignConfirmTransactionForm } from '../MultiSignConfirmTransactionForm';
import { EventContainer } from '../EventContainer';
import { contracts } from '../BlockChainProvider/contracts';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import type { MSConfig } from './index';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { useContractCall } from '../../hooks/useContractCall';

type RowProps = {
  item: MSConfig;
};

export const Row: React.FC<RowProps> = ({ item }) => {
  const { network, address } = useSelector(selectBlockChainProvider);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');

  const isOwner = useContractCall<boolean>(
    item.contractName,
    'isOwner',
    address,
  );

  return (
    <div className="container py-5">
      <h3>
        {item.prettyName} (
        <LinkToExplorer
          txHash={contracts[network][item.contractName]?.address!}
          isAddress={true}
        />
        ) - {isOwner.value ? 'You are signer' : 'You are NOT signer.'}
      </h3>
      <div className="lg:flex lg:flex-row lg:space-x-4">
        <div className="lg:w-6/12 lg:flex">
          <MultiSigTransactionForm contractName={item.contractName} />
        </div>
        <div className="lg:w-6/12">
          <div className="mt-5 lg:mt-0 lg:flex-grow md:flex md:flex-row md:space-x-4">
            <div className="md:w-4/12 lg:w-6/12 lg:flex">
              <MultiSignConfirmTransactionForm
                contractName={item.contractName}
                transactionId={selectedTransactionId}
              />
            </div>
            <div className="mt-5 md:mt-0 md:w-8/12 lg:w-6/12 lg:flex">
              <EventContainer
                contractName={item.contractName}
                onSelect={e => setSelectedTransactionId(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
