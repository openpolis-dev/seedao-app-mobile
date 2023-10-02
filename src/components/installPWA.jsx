import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { isAndroid, isIOS, isMobile } from "utils/userAgent";

console.log("[isAndroid]:", isAndroid);
console.log("[isiOS]:", isIOS);

export default function InstallCheck() {
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
  return (
    <InstallBox>
      {isAndroid && (
        <div>
          <button onClick={installApp}>Install</button>
        </div>
      )}
      {isIOS && "Install: Add to Homescreen"}
    </InstallBox>
  );
}

const InstallBox = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  text-align: center;
`;
