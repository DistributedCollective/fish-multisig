import { AbiItem } from 'web3-utils';

/* --- STATE --- */
export interface BlockChainProviderState {
  network: NetworkName;
  chainId: ChainId;
  setupCompleted: boolean;
  connected: boolean;
  connecting: boolean;
  address: string;
  blockNumber: number;
  syncBlockNumber: number;
  transactionStack: string[];
  transactions: Transactions;
  showTransactions: boolean;
}

export type NetworkName = keyof IContractNetworks;
export type ChainId = 30 | 31;

export type ContainerState = BlockChainProviderState;

export interface IContractNetworks {
  rsk_mainnet: Partial<INetworkToContract>;
  rsk_testnet: Partial<INetworkToContract>;
}

export interface INetworkToContract {
  multiSigOrigins: IContract;
  multiSigToken: IContract;
  multiSigDeposit: IContract;
  originsBase: IContract;
  fishToken: IContract;
}

export interface IContract {
  address: string;
  abi: AbiItem[] | AbiItem;
}

export interface Transactions {
  [transactionHash: string]: Transaction;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type TransactionType =
  | 'submitTransaction'
  | 'confirmTransaction'
  | undefined;

export interface Transaction {
  transactionHash: string;
  to: string;
  status: TransactionStatus;
  type?: TransactionType;
}

export interface DestinationContracts {
  rsk_mainnet: DestinationOption[];
  rsk_testnet: DestinationOption[];
}

export interface DestinationOption {
  value: string;
  label: string;
}

export type ContractName = keyof INetworkToContract;
