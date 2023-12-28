import { useState, useEffect } from "react";
import Layout from "components/layout/layout";
import { useEthersSigner } from "utils/ethersNew";
import getConfig from "constant/envCofnig";
import { useSelector } from "react-redux";

const network = getConfig().NETWORK;

export default function Chat() {
  const signer = useEthersSigner({ chainId: network.chainId });
  const account = useSelector((state) => state.account);

  const [status, setStatus] = useState(false);

  useEffect(() => {
    const init = window.chatWidgetApi.init;
    window.chatWidgetApi.init = (baseUri) => {
      init(baseUri);
      setStatus(true);
    };
  }, []);

  const signMessage = async ({ message }) => {
    return await signer.signMessage(message);
  };

  const loginCallback = (r) => {
    console.log("loginCallback: ", r);
  };

  const handleLogin = async () => {
    window.chatWidgetApi.thirdDIDLogin(account, signMessage, loginCallback);
  };
  console.log(account, status, signer);

  useEffect(() => {
    if (status && account && signer) {
      handleLogin();
    }
  }, [status, account, signer]);

  return (
    <Layout noTab title="Chat">
      <chat-component
        class="chat-widget"
        baseUrl="https://sdktest.sending.me"
        useThirdLogin={true}
        widgetWidth="100vw"
        widgetHeight="calc(100vh - 100px - env(safe-area-inset-bottom)) - env(safe-area-inset-top)"
      ></chat-component>
    </Layout>
  );
}
