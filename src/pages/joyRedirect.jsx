import { useSearchParams, useNavigate } from "react-router-dom";
import { sendTransactionCallback, signTypedDataCallback } from "@joyid/evm";
import { useEffect } from "react";
import { prepareMetaforo, loginByWallet } from "api/proposalV2";
import publicJs from "utils/publicJs";
import store from "store";
import { saveMetaforoToken } from "store/reducer";
import getConfig from "constant/envCofnig";
const CONFIG = getConfig();

export default function JoyIDRedirect() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  console.log(search);
  const action = search.get("action");

  const getLocalData = () => {
    const localsns = localStorage.getItem("sns") || "";
    let data;
    try {
      data = JSON.parse(localsns);
    } catch (error) {
      data = {};
    }
    return data;
  };

  const handleCommitData = (hash) => {
    const data = getLocalData();
    const account = localStorage.getItem("joyid-address");
    data[account] = {
      step: "commit",
      stepStatus: "pending",
      commitHash: hash,
      registerHash: "",
      secret: search.get("secret"),
      sns: search.get("sns"),
      timestamp: 0,
    };
    localStorage.setItem("sns", JSON.stringify(data));
  };

  const handleRegisterData = (hash) => {
    const data = getLocalData();
    const account = localStorage.getItem("joyid-address");
    data[account].step = "register";
    data[account].stepStatus = search.get("secret") !== "undefined" ? search.get("secret") : "pending";
    data[account].registerHash = hash;
    localStorage.setItem("sns", JSON.stringify(data));
  };
  const handleSignMetaforo = async () => {
    const res = signTypedDataCallback();
    const account = localStorage.getItem("joyid-address");
    const signData = publicJs.typedData(account, CONFIG.NETWORK.chainId);
    const data = await loginByWallet({
      web3_public_key: account,
      sign: res.signature,
      signMsg: JSON.stringify(signData),
      wallet_type: 5,
    });
    store.dispatch(saveMetaforoToken({ id: data.user.id, account, token: data.api_token }));
    try {
      await prepareMetaforo();
    } catch (error) {
      logError("prepareMetaforo failed", error);
    }

    const pathname = search.get("current");
    navigate(pathname, { replace: true });
  };

  const handleCreditData = () => {
    return { from: search.get("from"), to: search.get("to") };
  };

  useEffect(() => {
    console.log("===> joyid redirect action:", action);
    if (action === "sign-metaforo") {
      handleSignMetaforo();
      return;
    }
    let res = "";
    try {
      res = sendTransactionCallback();
      console.log("===> joyid redirect res:", res);
      if (res && res.tx) {
        switch (action) {
          case "sns-commit":
            handleCommitData(res.tx);
            navigate("/sns/register", { replace: true });
            break;
          case "sns-register":
            handleRegisterData(res.tx);
            navigate("/sns/register", { state: true, replace: true });
            break;
          case "sns-switch":
            navigate("/sns/user", { state: res.tx, replace: true });
            break;
          default:
            break;
        }
        return;
      }
    } catch (error) {
      logError(error);
    }
    if (["credit-borrow", "credit-borrow-approve", "credit-repay", "credit-repay-approve"].includes(action)) {
      console.log("res.tx", res.tx);
      window.open(`https://rpc-amoy.polygon.technology/tx/${res.tx}`, "_blank");
      navigate("/credit?tab=mine", { state: { action, ...handleCreditData(), tx: res?.tx }, replace: true });
      return;
    }
    if (!res) {
      switch (action) {
        case "sns-commit":
          navigate("/sns/register", { state: { sns: search.get("sns"), step: action }, replace: true });
          break;
        case "sns-register":
          navigate("/sns/register", { replace: true });
          break;
        case "sns-switch":
          navigate("/sns/user", { replace: true });
          break;
        default:
          break;
      }
    }
  }, []);

  return <></>;
}
