import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import '~/global.css';
import { COLORS } from '~/src/lib/constants';
import { useColorScheme } from '~/src/lib/useColorScheme';

export default function AppLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <>
      <StatusBar
        style={isDarkColorScheme ? 'light' : 'dark'}
        backgroundColor={isDarkColorScheme ? COLORS.i1 : COLORS.bgDefault}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="product/[id]"
          options={{
            title: t('navigation.product_detail'),
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: true,
            headerBackButtonDisplayMode: 'minimal',
            headerTitleStyle: {
              fontFamily: 'Expose-Bold',
            },
          }}
        />

        <Stack.Screen
          name="main/price-comparison-modal/price-comparison-modal-screen"
          options={{
            title: t('navigation.price_comparison'),

            headerShown: true,
            headerTitleStyle: {
              fontFamily: 'Expose-Bold',
            },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="main/archived-cart/[id]"
          options={{
            title: t('navigation.cart_detail'),

            headerShown: true,
            headerTitleStyle: {
              fontFamily: 'Expose-Bold',
            },
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="main/menu-screen/menu-screen"
          options={{
            title: t('navigation.settings'),
            headerShown: true,
            headerTitleStyle: {
              fontFamily: 'Expose-Bold',
            },
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack>
    </>
  );
}
