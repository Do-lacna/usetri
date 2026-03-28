import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from './locales/en/common';
import skCommon from './locales/sk/common';

const resources = {
  'sk-SK': {
    common: skCommon,
  },
  'en-US': {
    common: enCommon,
  },
  sk: {
    common: skCommon,
  },
  en: {
    common: enCommon,
  },
};

const savedLanguage = 'sk-SK'; // default to Slovak

const instance = i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'sk-SK',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default instance;
