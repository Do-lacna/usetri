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

const initI18n = async () => {
  let savedLanguage = "sk"; // default to Slovak

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
    compatibilityJSON: "v3", // Important for React Native
    resources,
    lng: savedLanguage,
    fallbackLng: "sk",
    defaultNS: "common",

    // Pridané: Vypnutie keySeparator pre správnu pluralizáciu s podčiarkovníkom
    keySeparator: false, // <-- TOTO JE DÔLEŽITÉ!
    pluralSeparator: "_", // Toto už máš správne
    contextSeparator: "_", // Toto už máš správne

    interpolation: {
      escapeValue: false,
    },

    pluralRules: {
      // Príklad pre slovenčinu (len pre demonštráciu, normálne sú už pravidlá vstavané)
      // Odporúčam toto robiť len vtedy, ak máš špecifické požiadavky,
      // ktoré sa líšia od štandardných CLDR pravidiel.
      sk: function (count) {
        if (count === 1) {
          console.log("Plural rule: one");

          return "one";
        }
        // Pre čísla končiace na 2, 3, 4 (okrem 12, 13, 14)
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (
          lastDigit >= 2 &&
          lastDigit <= 4 &&
          (lastTwoDigits < 10 || lastTwoDigits >= 20)
        ) {
          console.log("Plural rule: few");
          return "few";
        }
        // Pre 0, 5 a viac, a čísla končiace na 11, 12, 13, 14
        return "other";
      },

      // Príklad pre angličtinu (pre demonštráciu)
      // en: function(count) {
      //   if (count === 1) {
      //     return 'one';
      //   }
      //   return 'other';
      // }
    },

    // React specific options
    react: {
      useSuspense: false,
    },
  });

  console.log("i18n initialized with language:", savedLanguage);

  return i18n;
};

export default initI18n;
