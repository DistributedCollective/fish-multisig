import { IContractNetworks } from './types';
import MultiSigWallet from './abi/MultiSigWallet.json';
import OriginsBase from './abi/OriginsBase.json';
import ERC20Token from './abi/ERC20Token.json';

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
    originsBase: {
      address: '0xef0CF4969a9c0F55716327a63E05BCF9c7a7b472',
      abi: OriginsBase as any,
    },
    fishToken: {
      address: '0xaa7038D80521351F243168FefE0352194e3f83C3',
      abi: ERC20Token as any,
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
    originsBase: {
      address: '0x9FabDA843C611210d7bA48056B75a1e1884522ef',
      abi: OriginsBase as any,
    },
    fishToken: {
      address: '0x055A902303746382FBB7D18f6aE0df56eFDc5213',
      abi: ERC20Token as any,
    },
  },
};
