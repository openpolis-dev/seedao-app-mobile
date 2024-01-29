import RouterLink from "./router/router";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import "./locales";
import "md-editor-rt/lib/style.css";
import "./assets/styles/quill.css";
import { Suspense } from "react";
import Loading from "./components/loading";

import GlobalStyle from "./utils/GlobalStyle";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import InstallCheck from "components/thirdInstallPWA";
import RouterChecker from "./components/routerChecker";
import useToast from "hooks/useToast";
import { useEffect } from "react";
import EventHandler from "components/event/eventHandler";
import getConfig from "constant/envCofnig";
import ChooseRPC from "components/chooseRPC";
import ErrorBoundary from "components/errorBoundary";

const chains = getConfig().NETWORK.chainId === 1 ? [mainnet] : [polygon];

const projectId = "da76ddd6c7d31632ed7fc9b88e28a410";

const metadata = {
  name: "SeeDAO",
  description: "SeeDAO APP",
  url: window.location.origin,
  icons: [`${window.location.origin}/icon192.png`],
};

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableCoinbase: false,
  enableEmail: false,
  enableEIP6963: false,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  includeWalletIds: ["c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"],
});

function App() {
  const { Toast, showToast } = useToast();

  useEffect(() => {
    ["dev", "test"].includes(getConfig().REACT_APP_APP_VERSION) &&
      showToast(`load ${new Date().getTime() - window.START_TIME}ms`);
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Router>
                <RouterLink />
                <RouterChecker />
                <ChooseRPC />
              </Router>
              <EventHandler />
            </PersistGate>
          </Provider>
          <GlobalStyle />
        </WagmiConfig>
        <InstallCheck />
        {Toast}
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
