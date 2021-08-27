import React, { useCallback, useEffect, useState } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import {
  er20_mint_abi,
  er20_mint_abi_decode,
} from '../../BlockChainProvider/requests/erc20';
import {
  IErc20TransferSignature,
  ISubmitTransactionSignature,
} from '../../MultiSigTransactionForm/types';

interface Props {
  onData: (data: string) => void;
  value: ISubmitTransactionSignature;
}

export function Erc20MintForm(props: Props) {
  const [form, setForm] = useState({
    receiver: '',
    amount: '',
  });

  const handleInputChange = useCallback(
    (fieldName: keyof IErc20TransferSignature) => (
      event: React.FormEvent<HTMLInputElement>,
    ) => {
      const value = event.currentTarget.value;
      setForm(prevState => ({ ...prevState, [fieldName]: value }));
    },
    [],
  );

  useEffect(() => {
    try {
      const run = async () => {
        const data = await er20_mint_abi(
          props.value.destination,
          form.receiver,
          form.amount || '0',
        );
        if (data && data !== '0x') {
          console.log(er20_mint_abi_decode(data));
        }
        return data;
      };
      run().then(props.onData);
    } catch (e) {
      props.onData('0x');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, props.value.destination]);

  return (
    <section>
      <h3 className="mb-1">FISH.mint:</h3>
      <p className="mb-3 text-sm">Mint new FISH tokens to receiver address.</p>
      <div className="md:flex md:space-x-4">
        <div className="md:w-7/12">
          <FormGroup label="Receiver">
            <InputGroup
              leftIcon={'user'}
              value={form.receiver}
              onChange={handleInputChange('receiver')}
              placeholder="0x95f1f9393D1d3e46Df2cDa491fc323E142758c21"
            />
          </FormGroup>
        </div>
        <div className="md:w-5/12">
          <FormGroup label="Amount">
            <InputGroup
              leftIcon={'numerical'}
              value={form.amount}
              onChange={handleInputChange('amount')}
              placeholder="100.00000"
            />
          </FormGroup>
        </div>
      </div>
    </section>
  );
}
