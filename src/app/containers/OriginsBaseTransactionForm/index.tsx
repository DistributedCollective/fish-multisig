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
import {
  origins_getDepositAddress,
  origins_withdrawSaleDeposit_abi,
} from '../BlockChainProvider/requests/origins';
import { contracts } from '../BlockChainProvider/contracts';
import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { LinkToExplorer } from '../../components/LinkToExplorer';

interface Props {
  contractName: ContractName;
}

export const OriginsBaseTransactionForm: React.FC<Props> = props => {
  const { network, chainId } = useSelector(selectBlockChainProvider);

  const originsBaseAddress = contracts[network]['originsBase']?.address!;

  const [form] = useState({
    destination: originsBaseAddress,
    value: '0',
    data: origins_withdrawSaleDeposit_abi(originsBaseAddress),
  });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [depositAddress, setDepositAddress] = useState('');

  useEffect(() => {
    if (form.destination) {
      origins_getDepositAddress(form.destination)
        .then(setDepositAddress)
        .catch(what => console.error('what', what));
    }
  }, [form.destination]);

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
      const address = toChecksumAddress(depositAddress);
      const destinationValid = checkAddressChecksum(address);
      setIsValid(destinationValid);
    } catch (e) {
      setIsValid(false);
    }
  }, [depositAddress]);

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

        <section>
          <h3 className="mb-1">OriginBase.withdrawSaleDeposit:</h3>
          <p className="mb-3 text-sm">
            {' '}
            Withdraw Origin collected funds and remaining tokens after sale to
            deposit wallet{' '}
            {depositAddress && (
              <>
                (
                <LinkToExplorer
                  txHash={depositAddress}
                  isAddress={true}
                  className="text-blue-500"
                />
                )
              </>
            )}
          </p>
        </section>

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
