import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDisconnect } from "wagmi";

export default function EventHandler() {
  const { disconnect } = useDisconnect();

  const walletType = useSelector((state) => state.walletType);
  useEffect(() => {
    const handler = () => {
      if (walletType === "metamask") {
        disconnect();
      }
      window.location.replace(`${window.location.origin}/login`);
    };
    window.addEventListener("TOKEN_EXPIRED", handler);
    return () => {
      window.removeEventListener("TOKEN_EXPIRED", handler);
    };
  });
  return <></>;
}
