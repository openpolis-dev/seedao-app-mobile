import { useState } from "react";
import publicJs from "utils/publicJs";
import useToast from "./useToast";
import { useTranslation } from "react-i18next";
import { useNetwork } from "wagmi";
import { signTypedData } from "wagmi/actions";
import MetaforoLoginModal from "components/loginMetaforoModal";
import { prepareMetaforo, loginByWallet } from "api/proposalV2";
import store from "store";
import { saveMetaforoToken } from "store/reducer";
import { useSelector } from "react-redux";
import getConfig from "constant/envCofnig";
import { Wallet } from "utils/constant";
import { ConnectorNotFoundError } from "wagmi";
import LoadingModal from "components/LoadingModal";

import { signTypedDataWithRedirect } from "@joyid/evm";
import { useLocation, useNavigate } from "react-router-dom";
const CONFIG = getConfig();

const buildRedirectUrl = (action, current) => {
  const url = new URL(`${window.location.origin}/redirect?current=${current}`);
  url.searchParams.set("action", action);
  return url.href;
};

export default function useMetaforoLogin() {
  const account = useSelector((state) => state.account);
  const metaforoToken = useSelector((state) => state.metaforoToken);
  const wallet = useSelector((state) => state.walletType);
  const { pathname } = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { toast, Toast } = useToast();

  const go2login = async () => {
    setLoading(true);
    // sign
    try {
      const signData = publicJs.typedData(account, chain?.id || CONFIG.NETWORK.chainId);
      console.log("[signData]", signData);
      let sign;
      if (wallet === Wallet.JOYID) {
        signTypedDataWithRedirect(buildRedirectUrl("sign-metaforo", pathname), signData, account, {
          joyidAppURL: `${CONFIG.JOY_ID_URL}`,
          state: pathname,
          network: {
            chainId: CONFIG.NETWORK.chainId,
            name: CONFIG.NETWORK.name,
          },
        });
      } else {
        try {
          sign = await signTypedData(signData);
        } catch (error) {
          if (error instanceof ConnectorNotFoundError) {
            navigate("/login");
            return;
          }
          logError("login to metaforo failed", error);
          toast.danger(error?.data?.msg || error?.message || error?.details || `${t("Msg.ApproveFailed")} ${error}`);
          setLoading(false);
          return;
        }
      }

      const data = await loginByWallet({
        web3_public_key: account,
        sign,
        signMsg: JSON.stringify(signData),
        wallet_type: 5,
      });
      store.dispatch(saveMetaforoToken({ id: data.user.id, account, token: data.api_token }));
      try {
        await prepareMetaforo();
      } catch (error) {
        logError("prepareMetaforo failed", error);
      }
    } catch (error) {
      logError("login failed", error);
      toast.danger(error?.data?.msg || error?.message || `${error}`);
    } finally {
      setLoading(false);
      setShowLogin(false);
    }
    return true;
  };

  const checkMetaforoLogin = async () => {
    if (metaforoToken) {
      return true;
    }
    setShowLogin(true);
  };

  const LoginMetafoModal = loading ? (
    <LoadingModal msg={t("Proposal.Loging")} />
  ) : showLogin ? (
    <>
      <MetaforoLoginModal onClose={() => setShowLogin(false)} onConfirm={go2login} loading={loading} />
      {Toast}
    </>
  ) : null;

  return { checkMetaforoLogin, LoginMetafoModal };
}
