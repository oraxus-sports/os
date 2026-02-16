import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import taAuth from './locales/ta/auth.json';
import teAuth from './locales/te/auth.json';
import hiAuth from './locales/hi/auth.json';

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
