import auth, { signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { useSession } from '~/src/context/authentication-context';
import { resetAndRedirect } from '~/src/utils/navigation-utils';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

export function GoogleSignIn() {
  const { setUser } = useSession();

  useEffect(() => {
    // Check if user is already signed in
    const checkSignInStatus = async () => {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          console.log('User is already signed in with Google');
        }
      } catch (error) {
        console.log('Error checking sign-in status:', error);
      }
    };
    
    checkSignInStatus();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const response = await GoogleSignin.signIn();
      console.log('Google Sign-In successful:', response);

      // Get the ID token
      const idToken = response.data?.idToken;

      if (idToken) {
        // Create Firebase credential with the Google ID token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        console.log('Signing in with Firebase using Google credential');

        // Sign in with Firebase
        const { user } = await signInWithCredential(auth(), googleCredential);
        console.log('Firebase sign-in successful:', user.uid);

        // Update user session
        setUser(user);

        // Navigate to main screen
        resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('User cancelled the sign-in flow');
      } else if (error.code === 'IN_PROGRESS') {
        console.log('Sign-in is already in progress');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        console.log('Google Play services not available');
      } else {
        console.log('Unknown error:', error.message);
      }
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center bg-card border border-border rounded-md py-3 px-4 shadow-sm active:opacity-80 mb-2"
      style={{ width: 250, height: 44 }}
      onPress={handleGoogleSignIn}
    >
      <Image
        source={require('~/assets/images/logos/google_logo.png')}
        className="w-[16px] h-[16px] mr-2"
      />
      <Text
        className="text-foreground text-lg text-center"
        style={{ lineHeight: 18 }}
      >
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
