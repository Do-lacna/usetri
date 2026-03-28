import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';
import { useSession } from '~/src/context/authentication-context';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { resetAndRedirect } from '~/src/utils/navigation-utils';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

interface GoogleSignInProps {
  onLoadingChange?: (loading: boolean) => void;
}

export function GoogleSignIn({ onLoadingChange }: Readonly<GoogleSignInProps>) {
  const { t } = useTranslation();
  const { setUser } = useSession();
  const { isDarkColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  useEffect(() => {
    GoogleSignin.getCurrentUser();
  }, []);

  const handleGoogleSignIn = async () => {
    updateLoading(true);
    try {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken;

      if (idToken) {
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const { user } = await signInWithCredential(
          getAuth(),
          googleCredential,
        );

        setUser(user);

        resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
        updateLoading(false);
      }
    } catch (error: any) {
      updateLoading(false);
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center bg-card border border-border rounded-md py-3 px-4 shadow-sm active:opacity-80 mb-2"
      style={{ width: 250, height: 44, opacity: isLoading ? 0.6 : 1 }}
      onPress={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          className={isDarkColorScheme ? 'text-primary' : 'text-foreground'}
        />
      ) : (
        <>
          <Image
            source={require('~/assets/images/store-logos/google_logo.png')}
            className="w-[16px] h-[16px] mr-2"
          />
          <Text
            className="text-foreground font-sans text-lg text-center"
            style={{ lineHeight: 18 }}
          >
            {t('auth.sign_in_with_google')}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
