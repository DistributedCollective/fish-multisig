import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { Row } from './Row';
import { ContractName } from '../BlockChainProvider/types';
import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';

export type MSConfig = {
  contractName: ContractName;
  prettyName: string;
};

const contracts: MSConfig[] = [
  { contractName: 'multiSigDevTeam', prettyName: 'Dev Team MultiSig' },
  { contractName: 'multiSigDeposit', prettyName: 'Deposit Wallet MultiSig' },
  { contractName: 'multiSigToken', prettyName: 'Token MultiSig' },
  { contractName: 'multiSigOrigins', prettyName: 'Origins MultiSig' },
];

export function HomePage() {
  const { chainId } = useSelector(selectBlockChainProvider);

  const contractList = useMemo(() => {
    const clonedContracts = [...contracts];
    if (chainId === 31) {
      const index = clonedContracts.findIndex(
        item => item.contractName === 'multiSigDevTeam',
      );
      if (index !== -1) {
        clonedContracts.splice(index, 1);
      }
    }
    return clonedContracts;
  }, [chainId]);

  return (
    <>
      <Helmet>
        <title>FISH MultiSig</title>
        <meta name="description" content="FISH UI" />
      </Helmet>
      <Header />
      <main className="w-full flex-grow">
        <div className="bg-black">
          <div className="container">
            <h2 className="text-white pt-20 pb-8">FISH MultiSig</h2>
          </div>
        </div>
        {contractList.map(item => (
          <Row key={item.contractName} item={item} />
        ))}
      </main>
      <Footer />
    </>
  );
}
