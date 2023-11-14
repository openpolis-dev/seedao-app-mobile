import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { isAndroid, isIOS, isMobile } from "utils/userAgent";
import AppIcon from "assets/images/app.png";
import ShareIcon from "assets/images/install/share.svg";
import AddIcon from "assets/images/install/add.svg";
import { useTranslation } from "react-i18next";
import {X} from "react-bootstrap-icons";

console.log("[isAndroid]:", isAndroid);
console.log("[isiOS]:", isIOS);

export default function InstallCheck() {
  const { t } = useTranslation();
  const [isInstalled, setIsInstalled] = useState(true);
  const [show, setShow] = useState(true);

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
          {
            show &&<AndroidBox>
                <div className="left">
                  <img src={AppIcon} alt="" />
                  <span>SeeDAO</span>
                </div>
                <div className="lineRht">
                  <div className="btn-button" onClick={installApp}>
                    {t("Install.AndroidInstall")}
                  </div>
                  <div className="btn-cancel" onClick={()=>handleClose()}>
                    {t("general.cancel")}
                  </div>
                </div>
              </AndroidBox>
          }
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
                  <X />
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
  bottom: 0;
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
  img {
    width: 36px;
    margin-right: 10px;
  }
  .btn-button {
    cursor: pointer;
    line-height: 36px;
    padding-inline: 15px;
    border-radius: 4px;
    background-color: var(--bs-primary);
    color: #fff;
    font-size: 14px;
  }
  .lineRht{
    display: flex;
    align-items: center;
    
  }
  .btn-cancel {
    cursor: pointer;
    line-height: 36px;
    padding-inline: 15px;
    border-radius: 4px;
    border: 1px solid var(--bs-primary);
    color: var(--bs-primary);
    margin-left: 10px;
    font-size: 14px;
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
