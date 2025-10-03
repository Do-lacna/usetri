import LottieView from 'lottie-react-native';
import { View } from 'react-native';

import loadingAnimation from '~/assets/animations/loading-animation.json';
const OAuthRedirect = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        autoPlay
        style={{
          width: 300,
          height: 300,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={loadingAnimation}
      />
    </View>
  );
};

export default OAuthRedirect;
