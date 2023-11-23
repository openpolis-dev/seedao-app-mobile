import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { isAndroid, isIOS, isMobile } from "utils/userAgent";
import AppIcon from "assets/Imgs/install/app.png";
import ShareIcon from "assets/Imgs/install/share.svg";
import AddIcon from "assets/Imgs/install/add.svg";
import { useTranslation } from "react-i18next";
import CloseImg from "../assets/Imgs/close-circle.svg";

console.log("[isAndroid]:", isAndroid);
console.log("[isiOS]:", isIOS);

export default function InstallCheck() {
  const { t } = useTranslation();
  const [isInstalled, setIsInstalled] = useState(true);
  const [show, setShow] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (window.navigator?.standalone === true || window.matchMedia("(display-mode: standalone)").matches) {
      console.log("isInstalled: true. Already in standalone mode");
      setIsInstalled(true);
    } else {
      console.log("isInstalled: false");
      setIsInstalled(false);
    }
  }, []);
  const deferredPrompt = useRef();

  const handleBeforeInstallPromptEvent = (event) => {
    event.preventDefault();
    deferredPrompt.current = event;
    setCanInstall(true);
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPromptEvent);
    return function cleanup() {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPromptEvent);
    };
  }, []);

  useEffect(() => {
    const intallTips = sessionStorage.getItem("install-tips");
    if(intallTips == null) return;
    setShow(JSON.parse(intallTips))
  }, []);

  const handleClose = () =>{
    setShow(false);
    sessionStorage.setItem("install-tips",false);
  }

  const installApp = async () => {
    const current = deferredPrompt.current;
    console.log("[installApp] deferredPrompt:", current);
    if (!current) {
      return;
    }
    current
      .prompt()
      .then(() => current.userChoice)
      .then(({ outcome }) => {
        console.log("[installApp] outcome:", outcome);
      })
      .catch((error) => {
        console.error("[installApp] error:", error);
      });
  };

  if (isInstalled || !isMobile) {
    return <></>;
  }
  if (isAndroid) {
    return (
      <>
        {show && canInstall && (
          <AndroidBox>
            <div className="left">
              <img src={AppIcon} alt="" />
              <span>SeeDAO</span>
            </div>
            <div className="lineRht">
              <div className="btn-cancel" onClick={() => handleClose()}>
                {t("General.cancel")}
              </div>
              <div className="btn-button" onClick={installApp}>
                {t("Install.AndroidInstall")}
              </div>
            </div>
          </AndroidBox>
        )}
      </>
    );
  }
  if (isIOS) {
    return (
        <>
          {
            show && <IOSBox>
              <div className="header">
                {t("Install.IosTitle")}
                <div className="close" onClick={()=>handleClose()}>
                  <img src={CloseImg} alt=""/>
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
          }

        </>

    );
  }
  return <></>;
}

const AndroidBox = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  align-items: center;
  box-sizing: border-box;
  z-index: 99;
  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  img {
    width: 36px;
  }
  .btn-button {
    cursor: pointer;
    line-height: 32px;
    padding-inline: 15px;
    border-radius: 4px;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 14px;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .lineRht {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-cancel {
    cursor: pointer;
    line-height: 32px;
    padding-inline: 15px;
    border-radius: 4px;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    margin-left: 10px;
    font-size: 14px;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
`;

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
  .close{
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
