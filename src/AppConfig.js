const AppConfig = {
  DEFAULT_LANGUAGE: 'zh',
  // BASE_URL: 'https://test-api.seedao.tech',
  BASE_URL: 'https://api.seedao.tech',
  API_VERSION: 'v1',
  host: window.location.host,
  origin: window.location.origin,
  metamask: {
    websiteName: 'Super App',
    url: window.location.origin,
  },
  privacy: 'https://taoist-labs.github.io/privacy-policy/index.html',
  SCR_CONTRACT: '0xE4825A1a31a76f72befa47f7160B132AA03813E0',
  XAPIKEY: '3zrxnAwBgp72veeonB8KW2fa',
  deschool: 'https://deschool.app/origin/learn',
  OneSignalAppID: '2ba5cc16-6973-4361-864f-2a2c08aa383e',
  // SENTRY_DSN:
  //   'https://91e4220acbce4c2a9be6c7e7df439321@o4505590144106496.ingest.sentry.io/4505590148694016',
  Lan:[
    {
      name: "中文",
      value: "zh"
    },
    {
      name: "English",
      value: "en"
    }
  ]
};

export default AppConfig;
