import { Platform } from "react-native";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(142.1 76.2% 36.3%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(20 14.3% 4.1%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(24 9.8% 10%)", // card
    notification: "hsl(0 62.8% 30.6%)", // destructive
    primary: "hsl(142.1 70.6% 45.3%)", // primary
    text: "hsl(0 0% 100%)", // foreground
  },
};

export const PRIMARY_HEX = "#16a34a";

export const TERCIARY_HEX = "#034F4A";

export const DIVIDER_HEX = "#ccdbda";

export const NAVBAR_HEIGHT = Platform.OS === "ios" ? 80 : 70;

export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const DATE_FORMAT = "dd.MM.yyyy";

// export const BASE_API_URL = "https://dolacna-admin-api.default.offli.eu/";
export const BASE_API_URL =
  "https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/";

export const PLACEHOLDER_PRODUCT_IMAGE =
  "https://digitalcontent.api.tesco.com/v2/media/ghs/05c09f6c-82d2-4f55-a86d-dfc44e764d15/5e80370b-b62c-4012-8ded-e66ccb9d68be_1813485765.jpeg?h=960&w=960";

export const WEBPAGE_LINKS = {
  PRIVACTY_POLICY: "https://usetrislovensko.sk/PrivacyPolicy",
  HOW_IT_WORKS: "https://usetrislovensko.sk/HowItWorks",
  CONTACT: "https://usetrislovensko.sk/Contact",
  COOKIES: "https://usetrislovensko.sk/Cookies",
  TERMS_OF_SERVICE: "https://usetrislovensko.sk/TermsOfService",
};
