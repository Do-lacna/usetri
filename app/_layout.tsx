import '~/global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { getTheme, setTheme } from '~/persistence/theme-storage';
import { SessionProvider } from '../context/authentication-context';
import { RevenueCatProvider } from '../context/revenue-cat-provider';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // retry: (_, err: any) => {
      //   if (err?.response?.status === 401) {
      //     return true; // do not retry, trigger error
      //   }
      //   return false;
      // },
      retry: 2,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 1000 * 300, //5 minutes
      refetchIntervalInBackground: false,
      staleTime: 1000 * 300,
    },
    mutations: {
      retry: false,
    },
  },
});

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = getTheme();
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        setTheme(colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RevenueCatProvider>
        <SessionProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <ThemeProvider value={LIGHT_THEME}>
                <SafeAreaProvider>
                  <Slot />
                </SafeAreaProvider>
                <PortalHost />
                <Toast />
              </ThemeProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SessionProvider>
      </RevenueCatProvider>
    </QueryClientProvider>
  );
}
