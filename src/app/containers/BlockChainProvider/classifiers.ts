import { DestinationContracts, NetworkName } from './types';

export const networkTitles = {
  1: 'Ethereum',
  3: 'Ropsten',
  30: 'RootStock',
  31: 'RSK Testnet',
};

export const networks: { [key: number]: NetworkName } = {
  30: 'rsk_mainnet',
  31: 'rsk_testnet',
};

export const rpcNodes = {
  1: 'https://ropsten.infura.io/v3/237d5a5403134af7b7211fd6996c15d3',
  3: 'https://mainnet.infura.io/v3/237d5a5403134af7b7211fd6996c15d3',
  30: 'https://mainnet.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const wsNodes = {
  1: 'wss://ropsten.infura.io/ws/v3/237d5a5403134af7b7211fd6996c15d3',
  3: 'wss://mainnet.infura.io/ws/v3/237d5a5403134af7b7211fd6996c15d3',
  30: 'wss://mainnet.sovryn.app/websocket',
  31: 'wss://testnet.sovryn.app/ws',
};

export const blockExplorers = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
};

export const destinations: DestinationContracts = {
  rsk_mainnet: [
    { value: '0x055A902303746382FBB7D18f6aE0df56eFDc5213', label: 'FISH' },
    { value: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd', label: 'SOV' },
  ],
  rsk_testnet: [
    { value: '0xaa7038D80521351F243168FefE0352194e3f83C3', label: 'FISH' },
    { value: '0x6a9A07972D07e58F0daf5122d11E069288A375fb', label: 'SOV' },
  ],
};

// Block time in seconds
export const blockTime = 30;
