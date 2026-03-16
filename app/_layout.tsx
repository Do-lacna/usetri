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
import 'intl-pluralrules';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { SessionProvider } from '~/src/context/authentication-context';
import { RevenueCatProvider } from '~/src/context/revenue-cat-provider';
import '~/src/i18n';
import { setAndroidNavigationBar } from '~/src/lib/android-navigation-bar';
import { NAV_THEME } from '~/src/lib/constants';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { getTheme, setTheme } from '~/src/persistence/theme-storage';
// HotReloadSplash moved to a dev screen so layout no longer mounts it here.

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
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
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

  // animationDone and splashRef removed — splash rendering moved to a feature screen for dev.

  useEffect(() => {
    (async () => {
      const theme = getTheme();
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
        // Apply dark class to html element for proper CSS variable switching
        if (isDarkColorScheme) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      }

      // Consolidate theme selection and make sure we always set the android nav bar.
      const colorTheme = theme && theme === 'dark' ? 'dark' : 'light';
      if (!theme) {
        // Set default theme to light instead of using system preference
        setColorScheme('light');
        setTheme('light');
      } else if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
      }

      await setAndroidNavigationBar(colorTheme);

      // Ensure the native splash is hidden once theme is applied. Layout no longer shows
      // the HotReloadSplash; dev tooling for replaying the animation is available in the
      // discounts screen.
      await SplashScreen.hideAsync().catch((e) => {
        // Log to aid debugging but continue — splash may already be hidden.
        // eslint-disable-next-line no-console
        console.debug('SplashScreen.hideAsync failed:', e);
      });
    })();
  }, []);

  // Layout now always renders the app — HotReloadSplash is available in the discounts screen for dev.

  return (
    <QueryClientProvider client={queryClient}>
      <RevenueCatProvider>
        <SessionProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <ThemeProvider
                value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
              >
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
