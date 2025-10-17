import { Image, type ImageProps, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

interface ThemedLogoProps {
  width?: number;
  height?: number;
  className?: string;
  resizeMode?: ImageProps['resizeMode'];
}

export const ThemedLogo = ({
  width = 220,
  height = 110,
  className,
  resizeMode = 'contain',
}: ThemedLogoProps) => {
  const { isDarkColorScheme } = useColorScheme();

  // In dark mode, use the inverted logo (lighter version)
  // In light mode, use the default logo (darker version)
  const logoSource = isDarkColorScheme
    ? require('~/assets/images/usetri_white_logo.png')
    : require('~/assets/images/usetri_inverted_logo.png');

  return (
    <View style={{ width, height }} className={className}>
      <Image
        source={logoSource}
        style={{ width: '100%', height: '100%' }}
        resizeMode={resizeMode}
      />
    </View>
  );
};
