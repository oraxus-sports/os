// Intl.PluralRules polyfill is required in some JS environments (Hermes)
// to avoid i18next plural resolution warnings/errors.
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/ta';
import '@formatjs/intl-pluralrules/locale-data/te';
import '@formatjs/intl-pluralrules/locale-data/hi';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files from lib
import enAuth from '../../lib/i18n/locales/en/auth.json';
import taAuth from '../../lib/i18n/locales/ta/auth.json';
import teAuth from '../../lib/i18n/locales/te/auth.json';
import hiAuth from '../../lib/i18n/locales/hi/auth.json';

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
