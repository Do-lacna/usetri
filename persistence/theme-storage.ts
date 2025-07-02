import { storage } from "~/persistence/MMKV";

const THEME_KEY = "THEME_KEY";
const LANGUAGE_KEY = "LANGUAGE_KEY";

export const setTheme = (theme: string) => storage.set(THEME_KEY, theme);

export const getTheme = () => storage.getString(THEME_KEY);

export const setLanguage = (language: string) => storage.set(LANGUAGE_KEY, language);

export const getLanguage = () => storage.getString(LANGUAGE_KEY);
