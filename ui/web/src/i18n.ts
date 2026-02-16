import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files from lib via alias
import enAuth from '~/i18n/locales/en/auth.json';
import taAuth from '~/i18n/locales/ta/auth.json';
import teAuth from '~/i18n/locales/te/auth.json';
import hiAuth from '~/i18n/locales/hi/auth.json';

const resources = {
  en: {
    auth: enAuth,
  },
  ta: {
    auth: taAuth,
  },
  te: {
    auth: teAuth,
  },
  hi: {
    auth: hiAuth,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
