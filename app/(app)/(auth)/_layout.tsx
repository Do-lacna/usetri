import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          headerTitle: t('navigation.registration'),
          headerBackTitle: t('navigation.sign_in'),
        }}
      />
      <Stack.Screen
        name="forgotten-password"
        options={{
          headerShown: true,
          headerTitle: t('navigation.restore_password'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
