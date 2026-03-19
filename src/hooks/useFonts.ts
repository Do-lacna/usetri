import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          'Expose-Regular': require('../../assets/fonts/TTF/Expose-Variable.ttf'),
          'Expose': require('../../assets/fonts/TTF/Expose-Variable.ttf'),
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

