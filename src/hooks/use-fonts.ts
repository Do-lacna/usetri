import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          // Regular (400)
          Expose: require('../../assets/fonts/OTF/Expose-Regular.otf'),
          'Expose-Regular': require('../../assets/fonts/OTF/Expose-Regular.otf'),
          // Medium (500)
          'Expose-Medium': require('../../assets/fonts/OTF/Expose-Medium.otf'),
          // Bold (700)
          'Expose-Bold': require('../../assets/fonts/OTF/Expose-Bold.otf'),
          // Black (900)
          'Expose-Black': require('../../assets/fonts/OTF/Expose-Black.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setFontError(err);
        console.error('Failed to load fonts:', err);
      }
    })();
  }, []);

  return { fontsLoaded, fontError };
}
