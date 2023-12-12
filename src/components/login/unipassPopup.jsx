import { UniPassPopupSDK } from "@unipasswallet/popup-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import store from "../../store";
import { createSiweMessage } from "../../utils/publicJs";
import { saveAccount, saveUserToken, saveWalletType } from "../../store/reducer";
import { useNavigate } from "react-router-dom";
import { getNonce, login } from "../../api/user";
import AppConfig from "../../AppConfig";
import ReactGA from "react-ga4";
import usePushPermission from "hooks/usePushPermission";
import UnipassLogo from "../../assets/Imgs/unipass.svg";
import ArrImg from "../../assets/Imgs/arrow.svg";
import OneSignal from "react-onesignal";
import getConfig from "constant/envCofnig";
import { Wallet } from "utils/constant";
const networkConfig = getConfig().NETWORK;

export const uniWallet = new UniPassPopupSDK({
  env: "test",
  chainType: "eth",
  returnEmail: false,
  storageType: "localStorage",
  appSetting: {
    appName: "SeeDAO",
    appIcon: `${window.location.origin}/icon192.png`,
  },
  //   nodeRPC: networkConfig.rpc,
});

export default function Unipass() {
  const navigate = useNavigate();
  const [addr, setAddr] = useState();
  const [provider, setProvider] = useState();
  const [msg, setMsg] = useState(null);
  const [signInfo, setSignInfo] = useState();
  const [result, setResult] = useState(null);
  const handlePermission = usePushPermission();

  const getP = async () => {
    handlePermission(async () => {
      try {
        const { address } = await uniWallet.login({ forceLogin: true });
        setAddr(address);
        store.dispatch(saveAccount(address));
      } catch (e) {
        console.error(e);
      }
    });
  };

  useEffect(() => {
    if (!addr) return;
    signMessage();
  }, [addr]);

  const getMyNonce = async (wallet) => {
    let rt = await getNonce(wallet);
    return rt.data.nonce;
  };

  const signMessage = async () => {
    try {
      let nonce = await getMyNonce(addr);
      const eip55Addr = ethers.utils.getAddress(addr);

      const siweMessage = createSiweMessage(eip55Addr, networkConfig.chainId, nonce, "Welcome to SeeDAO!");
      setMsg(siweMessage);
      let res = await uniWallet.signMessage(siweMessage, { isEIP191Prefix: true, onAuthChain: true });
      setSignInfo(res);
    } catch (e) {
      console.error(e);
      store.dispatch(saveAccount(null));
      setAddr(null);
      await uniWallet.logout();
    }
  };

  useEffect(() => {
    if (!signInfo) return;
    LoginTo();
  }, [signInfo]);

  const LoginTo = async () => {
    const { host } = AppConfig;
    let obj = {
      wallet: addr,
      message: msg,
      signature: signInfo,
      domain: host,
      wallet_type: "AA",
      is_eip191_prefix: true,
    };
    try {
      let rt = await login(obj);
      const now = Date.now();
      rt.data.token_exp = now + rt.data.token_exp * 1000;
      store.dispatch(saveUserToken(rt.data));
      store.dispatch(saveWalletType(Wallet.UNIPASS));
      setResult(rt.data);
      try {
        await OneSignal.login(addr.toLocaleLowerCase());
      } catch (error) {
        console.error("OneSignal login error", error);
      }
      ReactGA.event("login_success", {
        type: "unipass",
        account: "account:" + addr,
      });
    } catch (e) {
      console.error(e);
      ReactGA.event("login_failed", { type: "unipass" });
    }
  };

  useEffect(() => {
    if (!result) return;
    const toSNS = localStorage.getItem(`==sns==`) === "1";
    navigate(toSNS ? "/sns/register" : "/home");
  }, [result]);

  return (
    <dl onClick={() => getP()}>
      <dt>
        <div className="logo">
          <img src={UnipassLogo} alt="" />
        </div>
        <span>UniPass</span>
      </dt>
      <img src={ArrImg} alt="" />
    </dl>
  );
}
