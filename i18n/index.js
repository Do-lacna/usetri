import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '~/persistence/theme-storage'; // Import the function to get saved language


// Import translations
import enCommon from '../locales/en/common';
import skCommon from '../locales/sk/common';

const resources = {
  sk: {
    common: skCommon,
  },
  en: {
    common: enCommon,
  },
};

const initI18n = async () => {
  let savedLanguage = 'sk'; // default to Slovak
  
  try {
    // Try to get saved language from AsyncStorage
    const storedLanguage =  getLanguage();
    if (storedLanguage) {
      savedLanguage = storedLanguage;
    } else {
      // Fallback to device language if no saved preference
      const deviceLanguage = Localization.locale.split('-')[0];
      savedLanguage = resources[deviceLanguage] ? deviceLanguage : 'sk';
    }
  } catch (error) {
    console.log('Error loading saved language:', error);
  }

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3', // Important for React Native
      resources,
      lng: savedLanguage,
      fallbackLng: 'sk',
      defaultNS: 'common',
      
      // Slovak pluralization rules
      pluralSeparator: '_',
      contextSeparator: '_',
      
      interpolation: {
        escapeValue: false,
      },
      
      // React specific options
      react: {
        useSuspense: false,
      },
    });

  return i18n;
};

export default initI18n;
