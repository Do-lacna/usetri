import {
  AppleAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import * as AppleAuth from 'expo-apple-authentication';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSession } from '~/src/context/authentication-context';
import { COLORS } from '~/src/lib/constants';
import { logError, logSignIn } from '~/src/utils/analytics';
import { resetAndRedirect } from '~/src/utils/navigation-utils';
import { useColorScheme } from '../../lib/useColorScheme';

interface AppleAuthenticationProps {
  onLoadingChange?: (loading: boolean) => void;
}

export default function AppleAuthentication({
  onLoadingChange,
}: Readonly<AppleAuthenticationProps>) {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const { setUser } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  const handleAppleSignIn = async () => {
    updateLoading(true);
    try {
      const credential = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = credential;

      if (!identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const appleCredential = AppleAuthProvider.credential(identityToken);

      // Sign in with Firebase
      const userCredential = await signInWithCredential(
        getAuth(),
        appleCredential,
      );

      setUser(userCredential.user);
      logSignIn('apple');
      resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
      updateLoading(false);
    } catch (e: any) {
      updateLoading(false);
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        // User canceled, no action needed
      } else {
        logError(e, 'signIn:apple');

        let errorMessage = t('auth.try_again');

        if (e?.code === 'auth/operation-not-allowed') {
          errorMessage = t('auth.apple_sign_in_not_allowed');
        } else if (e?.code === 'auth/invalid-credential') {
          errorMessage = t('auth.invalid_credentials');
        }

        Toast.show({
          type: 'error',
          text1: t('auth.apple_sign_in_error'),
          text2: errorMessage,
          position: 'bottom',
        });
      }
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      <AppleAuth.AppleAuthenticationButton
        buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          isDarkColorScheme
            ? AppleAuth.AppleAuthenticationButtonStyle.WHITE
            : AppleAuth.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={6}
        style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]}
        onPress={isLoading ? () => {} : handleAppleSignIn}
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator
            size="small"
            color={isDarkColorScheme ? COLORS.black : COLORS.white}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: 250,
    height: 44,
  },
  button: {
    width: 250,
    height: 44,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
