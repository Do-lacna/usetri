import auth from '@react-native-firebase/auth';
import * as AppleAuth from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSession } from '~/src/context/authentication-context';
import { resetAndRedirect } from '~/src/utils/navigation-utils';
import { useColorScheme } from '../../lib/useColorScheme';

export default function AppleAuthentication() {
  const { isDarkColorScheme } = useColorScheme();
  const { setUser } = useSession();

  const handleAppleSignIn = async () => {
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
    } catch (e: any) {
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
    <AppleAuth.AppleAuthenticationButton
      buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        isDarkColorScheme
          ? AppleAuth.AppleAuthenticationButtonStyle.WHITE
          : AppleAuth.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={5}
      style={styles.button}
      onPress={handleAppleSignIn}
    />
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
});
