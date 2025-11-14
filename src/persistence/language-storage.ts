import { storage } from '~/src/persistence/MMKV';

const LANGUAGE_KEY = 'user-language';

export const getLanguage = (): string | undefined => {
  return storage.getString(LANGUAGE_KEY);
};

export const setLanguage = (language: string): void => {
  storage.set(LANGUAGE_KEY, language);
};

export const removeLanguage = (): void => {
  storage.delete(LANGUAGE_KEY);
};
