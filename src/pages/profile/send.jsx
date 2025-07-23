import { useTranslation } from "react-i18next";
import BasicModal from "./basicModal";

import styled from "styled-components";
import { useState } from "react";



const Button = styled.button`
  background: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  padding: 5px 20px;
  border-radius: 4px;
`

const Box = styled(BasicModal)`
  width: 100%;
    dl{
        margin-bottom: 10px;

    }
    dt{
        font-size: 12px;
        margin-bottom: 5px;
        color: var(--bs-body-color_active);
    }
    dd{
        display: flex;
        align-items: center;
        gap: 10px;
        textarea,input{
            flex-grow: 1;
            border: 1px solid var(--border-color);
            background: var(--background-color-2);
            border-radius: 4px;
            padding: 4px 6px;
            &:focus{
                outline: none;
            }
        }
        span{
            color: var(--bs-body-color_active);
        }
    }
`

export default function SendModal({handleClose}){
  const { t } = useTranslation();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const handleInput = (e) => {
    const { value,name } = e.targe;
    if(name === "sendTo"){
      setAddress(value);
    }else{
      setAmount(value)
    }
  }

  const handleSend = () => {

    let obj= {
      address,
      amount
    }
    console.log(obj)

  }


  return <Box handleClose={handleClose} title={t('see.transfer')}>
      <dl>
        <dt>{t('see.sendTo')}</dt>
        <dd>
          <textarea name="sendTo" onChange={handleInput} value={address}  />
        </dd>
      </dl>
    <dl>
      <dt>{t('see.amount')}</dt>
      <dd>
        <input type="number" name="amount" onChange={handleInput} value={amount} />
        <span>SEE</span>
      </dd>
    </dl>
    <div>
      <Button variant="primary" onClick={()=>handleSend()}>{t('see.send')}</Button>
    </div>
  </Box>
}
