import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { Row } from './Row';
import { ContractName } from '../BlockChainProvider/types';

export type MSConfig = {
  contractName: ContractName;
  prettyName: string;
};

const contracts: MSConfig[] = [
  { contractName: 'multiSigOrigins', prettyName: 'Origins MultiSig' },
  { contractName: 'multiSigToken', prettyName: 'Token MultiSig' },
  { contractName: 'multiSigDeposit', prettyName: 'Deposit Wallet MultiSig' },
];

export function HomePage() {
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
        {contracts.map(item => (
          <Row key={item.contractName} item={item} />
        ))}
      </main>
      <Footer />
    </>
  );
}
