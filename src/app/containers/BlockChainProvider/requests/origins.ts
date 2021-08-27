import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import jsonInterface from '../abi/OriginsBase.json';
import { network } from '../network';

const web3 = new Web3();

const originContracts: { [key: string]: Contract } = {};

function getOriginContract(address: string) {
  if (!originContracts.hasOwnProperty(address)) {
    originContracts[address] = new network.web3.eth.Contract(
      jsonInterface as any,
      address,
    );
  }
  return originContracts[address];
}

export async function origins_getDepositAddress(address: string) {
  try {
    const contract = getOriginContract(address);
    return await contract.methods.getDepositAddress().call();
  } catch (e) {
    console.error('failed origins_getDepositAddress', e);
    return '0x';
  }
}

export function origins_withdrawSaleDeposit_abi(address: string) {
  try {
    const contract = getOriginContract(address);
    return contract.methods.withdrawSaleDeposit().encodeABI();
  } catch (e) {
    console.error(e);
    return '0x';
  }
}

export function origins_withdrawSaleDeposit_abi_decode(data) {
  try {
    const signature = web3.eth.abi.encodeFunctionSignature(
      'withdrawSaleDeposit()',
    );
    const da = data.substr(signature.length);
    return {
      signature,
      data: da,
      decoded: web3.eth.abi.decodeParameters([], data.substr(signature.length)),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
