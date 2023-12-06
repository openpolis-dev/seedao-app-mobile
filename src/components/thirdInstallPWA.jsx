import { useEffect, useState } from "react";
import styled from "styled-components";

import "@khmyznikov/pwa-install";
import { useTranslation } from "react-i18next";
import ShareIcon from "assets/Imgs/install/share.svg";
import AddIcon from "assets/Imgs/install/add.svg";
import CloseImg from "../assets/Imgs/close-circle.svg";

export default function InstallCheck() {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    if (window.navigator?.standalone === true || window.matchMedia("(display-mode: standalone)").matches) {
      console.log("isInstalled: true. Already in standalone mode");
      setIsInstalled(true);
    } else {
      console.log("isInstalled: false");
      setIsInstalled(false);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("install-tips", false);
  };

  useEffect(() => {
    const tag = document.querySelector("pwa-install");
    if (tag) {
      tag.showDialog();
    }
  }, []);

  return (
    <>
      <pwa-install
        manual-apple="true"
        manual-chrome="true"
        disable-install-description="true"
        name="SeeDAO"
        icon="/icon192.png"
      ></pwa-install>
      {!isInstalled && show && (
        <IOSBox>
          <div className="header">
            {t("Install.IosTitle")}
            <div className="close" onClick={() => handleClose()}>
              <img src={CloseImg} alt="" />
            </div>
          </div>
          <div className="bottom">
            <Step>
              <img src={ShareIcon} alt="" />
              <span>{t("Install.IosStep1")}</span>
            </Step>
            <Step>
              <img src={AddIcon} alt="" />
              <span>{t("Install.IosStep2")}</span>
            </Step>
          </div>
        </IOSBox>
      )}
    </>
  );
}

const IOSBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(215, 215, 215);
  border-radius: 10px 10px 0 0;
  z-index: 999;
  .header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 18px;
    color: #333;
    padding: 13px 16px;
    font-weight: 500;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close {
    font-size: 24px;
  }
  .bottom {
    padding-block: 20px;
  }
`;

const Step = styled.div`
  color: #7b7b7a;
  display: flex;
  gap: 20px;
  align-items: center;
  padding-inline: 16px;
  font-size: 13px;
  &:first-child {
    margin-bottom: 16px;
  }
  img {
    width: 24px;
  }
`;
