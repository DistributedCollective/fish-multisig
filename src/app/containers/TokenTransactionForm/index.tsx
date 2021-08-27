/**
 *
 * MultiSigTransactionForm
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';

import {
  checkAddressChecksum,
  toChecksumAddress,
} from '../../../utils/helpers';
import { multisign_submitTransaction } from '../BlockChainProvider/requests/multisig';
import { ContractName } from '../BlockChainProvider/types';
import { contracts } from '../BlockChainProvider/contracts';
import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { Erc20MintForm } from './components/Erc20MintForm';

interface Props {
  contractName: ContractName;
}

export const TokenTransactionForm: React.FC<Props> = props => {
  const { network, chainId } = useSelector(selectBlockChainProvider);
  const [form, setForm] = useState({
    destination: contracts[network]['fishToken']?.address!,
    value: '0',
    data: '0x',
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event && event.preventDefault && event.preventDefault();
      setIsLoading(true);
      try {
        await multisign_submitTransaction(
          props.contractName,
          form.destination,
          form.value,
          form.data,
        );
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    },
    [props.contractName, form],
  );

  useEffect(() => {
    try {
      const destination = toChecksumAddress(form.destination);
      const destinationValid = checkAddressChecksum(destination);
      const dataValid = form.data !== '0x';
      setIsValid(destinationValid && dataValid);
    } catch (e) {
      setIsValid(false);
    }
  }, [form]);

  return (
    <div className="bg-white rounded shadow p-3 lg:flex-1">
      <h3 className="mb-3 font-semibold">Submit Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="md:flex md:space-x-4">
          <div className="md:w-7/12">
            <FormGroup label="Destination">
              <InputGroup
                readOnly
                value={form.destination}
                placeholder="0x95f1f9393D1d3e46Df2cDa491fc323E142758c21"
              />
            </FormGroup>
          </div>
          <div className="md:w-5/12">
            <FormGroup
              label={[30, 31].includes(chainId) ? 'rBTC amount' : 'ETH amount'}
            >
              <InputGroup
                leftIcon={'numerical'}
                readOnly
                value={form.value}
                placeholder="0.001"
                rightElement={
                  <div className="py-2 px-3 text-xs text-gray-500">
                    {[30, 31].includes(chainId) ? 'rBTC' : 'ETH'}
                  </div>
                }
              />
            </FormGroup>
          </div>
        </div>

        <Erc20MintForm
          value={form}
          onData={data => setForm(prevState => ({ ...prevState, data }))}
        />

        <div className="p-3 bg-gray-300 text-sm break-all mb-3">
          {form.data}
        </div>

        <Button
          type="submit"
          icon={'send-to'}
          text="Submit Transaction"
          disabled={!isValid || isLoading}
          loading={isLoading}
        />
      </form>
    </div>
  );
};
