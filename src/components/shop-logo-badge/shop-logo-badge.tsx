import { Image } from 'expo-image';
import { memo } from 'react';

import { type ImageStyle, type StyleProp, View } from 'react-native';
import { getShopLogo } from '../../utils/logo-utils';

interface ShopLogoBadgeProps {
  shopId: number;
  size?: number;
  index?: number;
  style?: StyleProp<ImageStyle>;
}

const ShopLogoBadge = memo(
  ({ shopId, size = 18, index = 0, style }: ShopLogoBadgeProps) => {
    const logoProps = getShopLogo(shopId as any);

    if (!logoProps) return null;

    return (
      <View style={{ width: size, height: size, borderRadius: size / 2 }}>
        <Image
          source={logoProps.source}
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              position: 'absolute',
              right: index * 15,
              zIndex: index + 1,
              backgroundColor: 'white',
              borderColor: 'grey',
              borderWidth: 1,
              resizeMode: 'contain',
            },
            style,
          ]}
        />
      </View>
    );
  },
);

ShopLogoBadge.displayName = 'ShopLogoBadge';

export default ShopLogoBadge;
