const VERSION = '0.0.1';

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
  SNS_RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/HlAZ4I_XHDrPWs2x8L_7e6_3PQri91Il",
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: "test",
  REACT_APP_ONESIGNAL_ID: "2889344b-788a-40d5-8949-1ff1adc71851",
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: 'https://preview-api.seedao.tech',
  REACT_APP_THEME_ENABLE: false,
  REACT_APP_ONESIGNAL_ID: '',
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: 'https://api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://push-api.seedao.tech',
  REACT_APP_JOYID_ENABLE: false,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
  REACT_APP_THEME_ENABLE: false,
};

export default function getConfig() {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case 'prod':
      return PRODUCTION;
    case 'preview':
      return PREVIEW;
    case 'dev':
      return DEVELOPMENT;
    default:
      return LOCAL;
  }
}
