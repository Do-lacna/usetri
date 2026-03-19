import { Image, type ImageProps, View } from 'react-native';

interface ThemedLogoProps {
  width?: number;
  height?: number;
  className?: string;
  resizeMode?: ImageProps['resizeMode'];
}

export const ThemedLogo = ({
  width = 120,
  height = 120,
  className,
  resizeMode = 'contain',
}: ThemedLogoProps) => {
  // Use the smaller dimension to create a square container
  const size = Math.min(width, height);
  const borderRadius = size / 2;

  return (
    <View 
      style={{ 
        width: size, 
        height: size, 
        borderRadius,
        overflow: 'hidden',
      }} 
      className={className}
    >
      <Image
        source={require('../../assets/usetri_logo.png')}
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius,
        }}
        resizeMode={resizeMode}
      />
    </View>
  );
};
