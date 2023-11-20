import i18n from 'i18next';
import en from './i18n/en.json';
import store from '../store';
import zh from './i18n/zh.json';
import {initReactI18next} from 'react-i18next';
import AppConfig from '../AppConfig';
import {saveLang} from '../store/reducer';

async function getStoreLang() {
  const defaultLan = localStorage.getItem('lang');
  const userLanguage = defaultLan?defaultLan:(navigator.language || navigator.userLanguage);
  console.error(defaultLan,userLanguage)
  await i18n.changeLanguage(userLanguage);
  return userLanguage;
}


function saveStoreLang(lang) {
  // store.dispatch(saveLang(lang));
  localStorage.setItem("lang", lang);
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  compatibilityJSON: 'v3',
  lowerCaseLng: true,
  fallbackLng: AppConfig.DEFAULT_LANGUAGE,
  // lng: getStoreLang() || AppConfig.DEFAULT_LANGUAGE,
  lng: AppConfig.DEFAULT_LANGUAGE,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});
getStoreLang();
i18n.on('languageChanged', lang => {
  saveStoreLang(lang);
});
export default i18n;
