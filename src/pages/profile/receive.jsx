import styled from "styled-components";
import BasicModal from "./basicModal";
import { useTranslation } from "react-i18next";
import {CopyToClipboard} from "react-copy-to-clipboard";
import { Copy, CopyCheck } from "lucide-react";
import React, { useState } from "react";
import {useSelector} from "react-redux";
import useParseSNS from "../../hooks/useParseSNS";
import {QRCodeSVG} from 'qrcode.react';

const Box = styled(BasicModal)`
  width: 100%;
    word-break: break-all;
    .inner{
        background: var(--modal-background-color);
        display: flex;
        padding: 20px;
        align-items: center;
        justify-content: center;
        margin-top: -10px;
        img{
            width: 150px;
            height: 150px;
            box-sizing: content-box;
            padding: 5px;
            border-radius:4px;
            border: 1px solid var(--border-color);
        }
    }
`
const BtmLine = styled.div`
  display: flex;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    margin-top: 10px;
    gap: 10px;
`
export default function Receive({handleClose}){
  const { t } = useTranslation();

  const account = useSelector((state) => state.account);
  const sns = useParseSNS(account);
  const [codeCopied,setCodeCopied] = useState(false);

  const handleCodeCopy = ()=>{
    setCodeCopied(true);
    setTimeout(()=>{
      setCodeCopied(false);
    },1000)
  }

  return <Box  handleClose={handleClose} title={t('see.transfer')}>
    <div className="inner">
      {
          sns && <QRCodeSVG
              id="qr-code-canvas"
              value={sns}
              bgColor="#FFF"
              fgColor="#000"
              level="H"
              includeMargin={true}
          />
      }

    </div>
    <BtmLine>
      <span> {sns}</span>


      {
        !codeCopied &&   <CopyToClipboard text={sns} onCopy={handleCodeCopy}>
          <Copy size={18} />
        </CopyToClipboard>
      }
      {
        codeCopied && <CopyCheck size={18}  />
      }

      </BtmLine>
  </Box>
}
