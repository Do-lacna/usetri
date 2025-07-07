import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage } from "~/persistence/theme-storage"; // Import the function to get saved language

// Import translations
import enCommon from "../locales/en/common";
import skCommon from "../locales/sk/common";

const resources = {
  sk: {
    common: skCommon,
  },
  en: {
    common: enCommon,
  },
};

const slovakPluralRule = (count) => {
  if (count === 1) return "one";
  if (count >= 2 && count <= 4) return "few";
  return "other";
};

const initI18n = async () => {
  let savedLanguage = "sk-SK"; // default to Slovak

  try {
    // Try to get saved language from AsyncStorage
    const storedLanguage = await getLanguage(); // Použi await, ak getLanguage() vracia Promise
    if (storedLanguage) {
      console.log("Saved language found:", storedLanguage);

      savedLanguage = storedLanguage;
    } else {
      // Fallback to device language if no saved preference
      const deviceLanguage = Localization.locale.split("-")[0];
      savedLanguage = resources[deviceLanguage] ? deviceLanguage : "sk";
      console.log(
        "No saved language found, using device language:",
        savedLanguage
      );
    }
  } catch (error) {
    console.error("Error loading saved language:", error);
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "sk", // Change this to just "sk", not "sk-SK"
    defaultNS: "common",

    keySeparator: false,
    pluralSeparator: "_",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
    pluralResolvers: {
      sk: slovakPluralRule,
    },
  });

  console.log("i18n initialized with language:", savedLanguage);

  return i18n;
};

export default initI18n;
