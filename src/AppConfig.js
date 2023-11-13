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
  SCR_CONTRACT: '0xc74dee15a4700d5df797bdd3982ee649a3bb8c6c',
  XAPIKEY: '3zrxnAwBgp72veeonB8KW2fa',
  deschool: 'https://deschool.app/origin/learn',
  OneSignalAppID: '2ba5cc16-6973-4361-864f-2a2c08aa383e',
  // SENTRY_DSN:
  //   'https://91e4220acbce4c2a9be6c7e7df439321@o4505590144106496.ingest.sentry.io/4505590148694016',
  VAULTS: [
    {
      name: 'Assets.CommunityVault',
      address: '0x7FdA3253c94F09fE6950710E5273165283f8b283',
      chainId: 1,
      id: 1,
    },
    {
      name: 'Assets.CommunityVault',
      address: '0x4876eaD85CE358133fb80276EB3631D192196e24',
      chainId: 137,
      id: 2,
    },
    {
      name: 'Assets.CityHallVault',
      address: '0x70F97Ad9dd7E1bFf40c3374A497a7583B0fAdd25',
      chainId: 1,
      id: 3,
    },
    {
      name: 'Assets.IncubatorVault',
      address: '0x444C1Cf57b65C011abA9BaBEd05C6b13C11b03b5',
      chainId: 1,
      id: 4,
    },
  ],
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
