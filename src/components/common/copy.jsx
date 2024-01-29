import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import CopyIcon from "assets/Imgs/copy.svg";

const CopyBox = ({ children, text, dir, ...props }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async(text) => {
    try {
       // await navigator.clipboard.writeText(text);

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', text)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input)


      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);

    } catch (error) {

      logError('Failed to copy text: ', error);
    }
  };

  return (
    <>
      <div onClick={()=>handleCopy(text)}>
        <CopyContent className="copy-content" dir={dir || "right"} {...props}>
          {children || <img src={CopyIcon} className="copy-icon" alt="" />}
        </CopyContent>
      </div>
      {isCopied && (
        <TipsBox>
          <InnerBox>{t("General.Copied")}</InnerBox>
        </TipsBox>
      )}
    </>
  );
};

export default CopyBox;

const rightStyle = css`
  .tooltip-content {
    right: -74px;
  }
  .tooltip-content::before {
    right: unset;
    left: -18px;
    transform: translateX(50%) rotate(-90deg);
  }
`;

const CopyContent = styled.div`
  cursor: pointer;
  position: relative;
  .copy-icon {
    display: block;
  }
  .tooltip-content {
    position: absolute;
    padding: 5px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    right: 30px;
    top: -5px;
    white-space: nowrap;
    background: #000;
    color: #fff;
    z-index: 99;
    font-size: 12px;
  }
  .tooltip-content::before {
    content: "";
    position: absolute;
    border: 6px solid transparent;
    border-bottom-color: #000;
    top: 10px;
    right: -6px;
    transform: translateX(50%) rotate(90deg);
  }
  ${({ dir }) => dir === "right" && rightStyle}
`;

const TipsBox = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0;
  bottom: 0;
  z-index: 999;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerBox = styled.span`
  display: inline-block;
  background: rgba(0, 0, 0, 0.75);
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
`;
