import { useTranslation } from "react-i18next";
import BasicModal from "./basicModal";

import styled from "styled-components";
import { useState } from "react";
import {ScanLine,X} from "lucide-react";
import QrScanner from "./scan";
import {getConfig} from "@joyid/evm";
import sns from "@seedao/sns-js";
import {transferSEE} from "../../api/see";
import useToast from "../../hooks/useToast";


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
  const [comment, setComment] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { Toast, toast, showToast } = useToast();

  const handleInput = (e) => {
    const { value,name } = e.target;
    if(name === "sendTo"){
      setAddress(value);
    }else if(name === "comment"){
      setComment(value)
    }else{
      setAmount(value)
    }
  }

  const handleSend = async() => {

    try {
      const rpc  = getConfig()?.NETWORK?.rpcs[0];
      let snsAddress = await sns.resolve(address,rpc);
      console.log(snsAddress);

      let obj= {
        to:snsAddress,
        amount,
        asset_name:"SEE",
        comment
      }


      await transferSEE(obj)

      toast.success(t("see.transferSuccess"));

      // window.location.reload();
    } catch(error) {

      console.error(error)
      toast.danger(`${error?.data?.msg || error?.code || error}`);
    }finally{
      setTimeout(()=>{
        handleClose()
      },500)

    }
  }

  const handleScanResult = (result) => {
    setAddress(result ?? "")
    if (result) setIsScanning(false);
  };


  return <Box handleClose={handleClose} title={t('see.transfer')}>
    <QrScanner
        isScanning={isScanning}
        onScanResult={handleScanResult}
    />
    {Toast}
      <dl>
        <dt>{t('see.sendTo')}</dt>
        <dd>
          <input type="text" name="sendTo" onChange={handleInput} value={address}  />
          <span onClick={() => setIsScanning(!isScanning)}>{isScanning?<X />:<ScanLine />}</span>
        </dd>
      </dl>
    <dl>
      <dt>{t('see.amount')}</dt>
      <dd>
        <input type="number" name="amount" onChange={handleInput} value={amount} />
        <span>SEE</span>
      </dd>
    </dl>

    <dl>
      <dt>{t('see.comment')}</dt>
      <dd>
        <textarea name="comment" onChange={handleInput} value={comment}  />
      </dd>
    </dl>
    <div>
      <Button variant="primary" onClick={()=>handleSend()}>{t('see.send')}</Button>
    </div>
  </Box>
}
