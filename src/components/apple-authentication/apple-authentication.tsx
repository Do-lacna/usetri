import auth from '@react-native-firebase/auth';
import * as AppleAuth from 'expo-apple-authentication';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSession } from '~/src/context/authentication-context';
import { resetAndRedirect } from '~/src/utils/navigation-utils';
import { useColorScheme } from '../../lib/useColorScheme';

interface AppleAuthenticationProps {
  onLoadingChange?: (loading: boolean) => void;
}

export default function AppleAuthentication({
  onLoadingChange,
}: AppleAuthenticationProps) {
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

      // Create a Firebase credential from the Apple ID token
      const { identityToken } = credential;

      if (!identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const appleCredential = auth.AppleAuthProvider.credential(identityToken);

      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(appleCredential);

      console.log('Successfully signed in with Apple:', userCredential.user);
      setUser(userCredential.user);
      resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
      updateLoading(false);
    } catch (e: any) {
      updateLoading(false);
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in flow
        console.log('Apple sign-in canceled by user');
      } else {
        console.error('Apple Sign-In Error:', e);

        let errorMessage = 'Skúste to prosím znova';

        if (e?.code === 'auth/operation-not-allowed') {
          errorMessage = 'Apple prihlásenie nie je momentálne povolené';
        } else if (e?.code === 'auth/invalid-credential') {
          errorMessage = 'Neplatné prihlasovacie údaje';
        }

        Toast.show({
          type: 'error',
          text1: 'Nepodarilo sa prihlásiť cez Apple',
          text2: errorMessage,
          position: 'bottom',
        });
      }
    }
  };

  return (
    <View style={styles.button}>
      <AppleAuth.AppleAuthenticationButton
        buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          isDarkColorScheme
            ? AppleAuth.AppleAuthenticationButtonStyle.WHITE
            : AppleAuth.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={5}
        style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]}
        onPress={isLoading ? () => {} : handleAppleSignIn}
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator
            size="small"
            color={isDarkColorScheme ? '#000000' : '#FFFFFF'}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
