import { Redirect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import loadingAnimation from '~/assets/animations/loading-animation.json';
import { useSession } from '~/src/context/authentication-context';

const AppIndex = () => {
  const { user, isLoading } = useSession();

  // Show a nice loading animation while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <LottieView
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
          }}
          source={loadingAnimation}
        />
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log('no user');
    return <Redirect href="/(app)/(auth)/sign-in" />;
  }

  console.log('redirecting');

  return <Redirect href="/(app)/main/(tabs)/discounts-screen" />;
};

export default AppIndex;
