import { useSendTransaction } from "wagmi";
import { useSelector } from "react-redux";
import { Wallet } from "utils/constant";
import { sendTransactionWithRedirect } from "@joyid/evm";
import getConfig from "constant/envCofnig";
import { uniWallet } from "components/login/unipassPopup";

const CONFIG = getConfig();

export default function useTransaction(action) {
  const account = useSelector((state) => state.account);
  const wallet = useSelector((state) => state.walletType);
  const rpc = useSelector((state) => state.rpc);

  const { sendTransactionAsync } = useSendTransaction();

  const handleJoyID = (params, secret, sns) => {
    const buildRedirectUrl = () => {
      const url = new URL(`${window.location.origin}/redirect?secret=${secret}&sns=${sns}`);
      url.searchParams.set("action", action);
      return url.href;
    };
    const url = buildRedirectUrl();
    sendTransactionWithRedirect(url, params, account, {
      joyidAppURL: `${CONFIG.JOY_ID_URL}`,
      rpcURL: rpc || CONFIG.NETWORK.rpcs[0],
    });
  };

  const handleTransaction = (contractAddress, data, secret, sns) => {
    const params = {
      to: contractAddress,
      from: account,
      value: "0",
      data,
    };
    console.log("use wallet:", wallet);
    if (wallet === Wallet.METAMASK) {
      return sendTransactionAsync(params);
    } else if (wallet === Wallet.JOYID) {
      return handleJoyID(params, secret, sns);
    } else if (wallet === Wallet.UNIPASS) {
      return uniWallet.sendTransaction(params);
    }
  };
  return { handleTransaction };
}
