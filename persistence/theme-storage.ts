import { storage } from "~/persistence/MMKV";

const THEME_KEY = "THEME_KEY";

export const setTheme = (theme: string) => storage.set(THEME_KEY, theme);

export const getTheme = () => storage.getString(THEME_KEY);
