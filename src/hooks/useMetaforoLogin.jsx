import { useState } from "react";
import publicJs from "utils/publicJs";
import useToast from "./useToast";
import { useTranslation } from "react-i18next";
import { useNetwork } from "wagmi";
import { signTypedData } from "wagmi/actions";
import MetaforoLoginModal from "components/loginMetaforoModal";
import { prepareMetaforo, loginByWallet } from "api/proposalV2";
import store from "store";
import { saveMetaforoToken, saveLoading } from "store/reducer";
import { useSelector } from "react-redux";

export default function useMetaforoLogin() {
  const account = useSelector((state) => state.account);
  const metaforoToken = useSelector((state) => state.metaforoToken);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();

  const { t } = useTranslation();
  const { toast } = useToast();

  const go2login = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // sign
    try {
      console.log("[typedData] params", account, chain.id);
      const signData = publicJs.typedData(account, chain.id);
      console.log("[signData]", signData);
      // @ts-ignore
      const sign = await signTypedData(signData);
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
      return;
    } finally {
      setLoading(false);
      setShowLogin(false);
    }
    return true;
  };

  const checkMetaforoLogin = async () => {
    if (metaforoToken?.token && account?.toLocalLowercase() === metaforoToken?.account?.toLocalLowercase()) {
      return true;
    }
    setShowLogin(true);
  };

  const LoginMetafoModal = showLogin ? (
    <MetaforoLoginModal onClose={() => !loading && setShowLogin(false)} onConfirm={go2login} />
  ) : null;

  return { checkMetaforoLogin, LoginMetafoModal };
}
