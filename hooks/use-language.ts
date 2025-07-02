import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

//   const changeLanguage =  (language) => {
//     try {
//       await AsyncStorage.setItem('user-language', language);
//       await i18n.changeLanguage(language);
//     } catch (error) {
//       console.log('Error saving language:', error);
//     }
  //  setLanguage(...)
//   };

  const getCurrentLanguage = () => i18n.language;
  
//   const isLanguage = (lang) => i18n.language === lang;

  return {
    // changeLanguage,
    getCurrentLanguage,
    // isLanguage,
    currentLanguage: i18n.language,
  };
};