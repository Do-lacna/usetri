import { View } from 'react-native';
import { useColorScheme } from '~/src/lib/useColorScheme';

import LilacLogo from '~/assets/images/claim-logo/usetri-logo_claim-lilac.svg';
import PurpleLogo from '~/assets/images/claim-logo/usetri-logo_claim-purple.svg';

interface ThemedLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ThemedLogo = ({
  width = 220,
  height = 110,
  className,
}: ThemedLogoProps) => {
  const { isDarkColorScheme } = useColorScheme();

  const LogoComponent = isDarkColorScheme ? LilacLogo : PurpleLogo;

  return (
    <View style={{ width, height }} className={className}>
      <LogoComponent width={width} height={height} />
    </View>
  );
};
