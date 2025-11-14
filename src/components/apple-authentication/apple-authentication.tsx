import * as AppleAuth from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../lib/useColorScheme';

export default function AppleAuthentication() {
  const { isDarkColorScheme } = useColorScheme();

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
      onPress={async () => {
        try {
          const credential = await AppleAuth.signInAsync({
            requestedScopes: [
              AppleAuth.AppleAuthenticationScope.FULL_NAME,
              AppleAuth.AppleAuthenticationScope.EMAIL,
            ],
          });

          console.log(credential);
          // signed in
        } catch (e: any) {
          if (e?.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
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
