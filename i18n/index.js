import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from './locales/en/common';
import skCommon from './locales/sk/common';

const resources = {
  'sk-SK': {
    common: skCommon,
  },
  'ar-AR': {
    common: enCommon,
  },
};

const savedLanguage = 'sk-SK'; // default to Slovak

// try {
//   // Try to get saved language from AsyncStorage
//   const storedLanguage = await getLanguage(); // Použi await, ak getLanguage() vracia Promise
//   if (storedLanguage) {
//     console.log("Saved language found:", storedLanguage);

//     savedLanguage = storedLanguage;
//   } else {
//     // Fallback to device language if no saved preference
//     const deviceLanguage = Localization.locale.split("-")[0];
//     savedLanguage = resources[deviceLanguage] ? deviceLanguage : "sk";
//     console.log(
//       "No saved language found, using device language:",
//       savedLanguage
//     );
//   }
// } catch (error) {
//   console.log("Error loading saved language:", error);
// }
const instance = i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'sk-SK', // Change this to just "sk", not "sk-SK"
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default instance;
