import { storage } from '~/src/persistence/MMKV';

const GUEST_MODE_KEY = 'GUEST_MODE';

export const setGuestMode = (isGuest: boolean) => {
  storage.set(GUEST_MODE_KEY, isGuest ? 'true' : 'false');
};

export const isGuestMode = () => {
  const guestMode = storage.getString(GUEST_MODE_KEY);
  return guestMode === 'true';
};

export const clearGuestMode = () => {
  storage.delete(GUEST_MODE_KEY);
};
