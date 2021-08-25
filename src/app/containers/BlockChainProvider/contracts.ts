import { IContractNetworks } from './types';
import MultiSigWallet from './abi/MultiSigWallet.json';

export const contracts: IContractNetworks = {
  rsk_testnet: {
    multiSigOrigins: {
      address: '0x30bdc896Ab0CE5D3A9a112174F814E2Eb9c18911',
      abi: MultiSigWallet as any,
    },
    multiSigToken: {
      address: '0x7e0980892E25bEe5a3D2fB76be0E5E9746Fae5aA',
      abi: MultiSigWallet as any,
    },
    multiSigDeposit: {
      address: '0x52AD0a0b5Df441009fe1b1Ee83e41D74168928a0',
      abi: MultiSigWallet as any,
    },
  },
  rsk_mainnet: {
    multiSigOrigins: {
      address: '0x8df94D78f209B9052429f32b54482C3C74594f2F',
      abi: MultiSigWallet as any,
    },
    multiSigToken: {
      address: '0x26712A09D40F11f34e6C14633eD2C7C34c903eF0',
      abi: MultiSigWallet as any,
    },
    multiSigDeposit: {
      address: '0xBb4ec577C084A17160F5A016A1a58f51bc6B0609',
      abi: MultiSigWallet as any,
    },
  },
};
