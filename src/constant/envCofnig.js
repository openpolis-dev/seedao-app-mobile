import EthereumIcon from "assets/Imgs/network/ethereum.svg";
import PolygonIcon from "assets/Imgs/network/polygon.svg";

const VERSION = "0.3.1";

const LOCAL = {
  REACT_APP_BASE_ENDPOINT: "https://test-api.seedao.tech",
  REACT_APP_PUSH_ENDPOINT: "https://test-push-api.seedao.tech",
  REACT_APP_MOBILE_URL: "",
  REACT_APP_MOBILE_OPEN: false,
  REACT_APP_ENV: "test",
  REACT_APP_JOYID_ENABLE: true,
  REACT_APP_ONESIGNAL_ID: "9c6122e1-3de4-4c03-8e68-9f357e9ca1ae",
  REACT_APP_APP_VERSION: `A ${VERSION}`,
  REACT_APP_THEME_ENABLE: true,
  JOY_ID_URL: "https://app.joy.id",
  NETWORK: {
    name: "Polygon",
    chainId: 137,
    // rpcs: [
    //   "https://eth-goerli.g.alchemy.com/v2/MATWeLJN1bEGTjSmtyLedn0i34o1ISLD",
    //   "https://rpc.ankr.com/eth_goerli",
    //   "https://endpoints.omniatech.io/v1/eth/goerli/public",
    // ],
    rpcs: [
      "https://polygon-mainnet.g.alchemy.com/v2/-MLinGy2l91vLVZWXmRfNYf9DavMxaEA",
      "https://polygon-pokt.nodies.app",
      "https://polygon.llamarpc.com",
    ],
    icon: PolygonIcon,
    tokens: [
      {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        name: "USDT",
        decimals: 6,
        price: 5,
      },
    ],
    whitelistId: 0,
  },
  INDEXER_ENDPOINT: "https://test-spp-indexer.seedao.tech",
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: "test",
  REACT_APP_ONESIGNAL_ID: "2889344b-788a-40d5-8949-1ff1adc71851",
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: "https://preview-api.seedao.tech",
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: "5abed421-a9a0-4811-b255-bc48fa7d4fa4",
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: "https://api.seedao.tech",
  REACT_APP_PUSH_ENDPOINT: "https://push-api.seedao.tech",
  REACT_APP_JOYID_ENABLE: true,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: "eda76843-e1a4-40a5-aa01-3d860d9cfa5c",
  // JOY_ID_URL: 'https://app.joy.id',
};

export default function getConfig() {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case "prod":
      return PRODUCTION;
    case "preview":
      return PREVIEW;
    case "dev":
      return DEVELOPMENT;
    default:
      return LOCAL;
  }
}
