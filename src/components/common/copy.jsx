import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled, { css } from "styled-components";
import CopyIcon from "assets/Imgs/copy.svg";

const CopyBox = ({ children, text, dir }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  return (
    <>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <CopyContent className="copy-content" dir={dir || "right"}>
          {children || <img src={CopyIcon} className="copy-icon" alt="" />}
          {/* {isCopied && <span className="tooltip-content">{t("mobile.copied")}</span>} */}
        </CopyContent>
      </CopyToClipboard>
      {isCopied && (
        <TipsBox>
          <InnerBox>{t("mobile.copied")}</InnerBox>
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
  background: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 10px 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
`;
