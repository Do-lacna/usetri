import * as FileSystem from 'expo-file-system';

const LOYALTY_CARDS_DIR = `${FileSystem.documentDirectory}loyalty-cards/`;

const ensureDir = async () => {
  const info = await FileSystem.getInfoAsync(LOYALTY_CARDS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(LOYALTY_CARDS_DIR, {
      intermediates: true,
    });
  }
};

const extensionFromUri = (uri: string) => {
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : 'jpg';
};

export const persistLoyaltyCardImage = async (
  shopId: number,
  sourceUri: string,
): Promise<string> => {
  await ensureDir();
  const ext = extensionFromUri(sourceUri);
  const destination = `${LOYALTY_CARDS_DIR}${shopId}-${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  return destination;
};

export const deleteLoyaltyCardImage = async (uri?: string) => {
  if (!uri) return;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // swallow — image may already be gone
  }
};
