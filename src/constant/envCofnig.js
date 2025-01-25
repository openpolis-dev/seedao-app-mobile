import EthereumIcon from "assets/Imgs/network/ethereum.svg";
import PolygonIcon from "assets/Imgs/network/polygon.svg";
import { amoy } from "utils/chain";
import { polygon } from "viem/chains";


const VERSION = "0.7.4";


const SENTRY_DSN = "https://54ec7357966342699d508a552ec1927c@o4505590144106496.ingest.sentry.io/4505590153805824";

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
  // JOY_ID_URL: "https://app.joy.id",
  JOY_ID_URL: "https://testnet.joyid.dev",
  NETWORK: {
    name: "Polygon",
    nativeToken: "POL",
    chainId: 137,
    // rpcs: [
    //   "https://eth-goerli.g.alchemy.com/v2/MATWeLJN1bEGTjSmtyLedn0i34o1ISLD",
    //   "https://rpc.ankr.com/eth_goerli",
    //   "https://endpoints.omniatech.io/v1/eth/goerli/public",
    // ],
    rpcs: [
      // "https://polygon-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE",
      'https://polygon-mainnet.g.alchemy.com/v2/YuNeXto27ejHnOIGOwxl2N_cHCfyLyLE',
      // "https://polygon-pokt.nodies.app",
      // "https://polygon.llamarpc.com",
    ],
    icon: PolygonIcon,
    explorer:"https://polygonscan.com",
    tokens: [
      {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        name: "USDT",
        decimals: 6,
        price: 5,
      },
    ],
    whitelistId: 0,
    SCRContract: { address: "0xdC907cd32Bc3D6bb2c63Ede4E28c3fAcdd1d5189", decimals: 18 },
    lend: {
      chain: amoy,
      bondNFTContract: "0x496EBfDe236617821BAc1A2486993204378eE6C8",
      scoreLendContract: "0xa868415159Dc88506A9A55fe12E98B171491018d",
      lendToken: {
        address: "0xca152522f26811fF8FcAf967d4040F7C6BbF8eaA",
        decimals: 6,
        symbol: "USDC",
      },
    },
  },
  INDEXER_ENDPOINT: "https://test-spp-indexer.seedao.tech",
  SENDINGME_ENABLE: true,
  SENTRY_DSN,
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: "test",
  REACT_APP_ONESIGNAL_ID: "2889344b-788a-40d5-8949-1ff1adc71851",
  SENDINGME_ENABLE: true,
  SENTRY_DSN,
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: "https://preview-api.seedao.tech",
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: "5abed421-a9a0-4811-b255-bc48fa7d4fa4",
  SENDINGME_ENABLE: false,
  SENTRY_DSN,
  JOY_ID_URL: "https://testnet.joyid.dev",
  NETWORK: {
    ...LOCAL.NETWORK,
    lend: {
      ...LOCAL.NETWORK.lend,
      bondNFTContract: "0x5eC2dDFdEACB1a4bB4145908bB29D833Fd810712",
      scoreLendContract: "0xcF5504045f74f6A51828B9D8766E4d96822311dE",
    },
  },
  INDEXER_ENDPOINT: "https://preview-spp-indexer.seedao.tech",
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: "https://api.seedao.tech",
  REACT_APP_PUSH_ENDPOINT: "https://push-api.seedao.tech",
  REACT_APP_JOYID_ENABLE: true,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: "eda76843-e1a4-40a5-aa01-3d860d9cfa5c",
  SENDINGME_ENABLE: false,
  SENTRY_DSN,
  JOY_ID_URL: "https://app.joy.id",
  NETWORK: {
    ...LOCAL.NETWORK,
    SCRContract: { address: "0xE4825A1a31a76f72befa47f7160B132AA03813E0", decimals: 18 },
    lend: {
      ...LOCAL.NETWORK.lend,
      chain: polygon,
      bondNFTContract: "0xC40EB71f46baE4d2395734C14af3bd86960F2c4c",
      scoreLendContract: "0xaB9B36BC114c433182ebE840Fa966A5808883661",
      lendToken: {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        decimals: 6,
        symbol: "USDC",
      },
    },
  },
  INDEXER_ENDPOINT: "https://spp-indexer.seedao.tech",
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
