import { Image } from 'expo-image';
import { memo } from 'react';

import { type ImageStyle, type StyleProp, View } from 'react-native';
import { PRIMARY_HEX } from '../../lib/constants';
import { getShopLogo } from '../../utils/logo-utils';

interface ShopLogoBadgeProps {
  shopId: number;
  size?: number;
  index?: number;
  style?: StyleProp<ImageStyle>;
  highlighted?: boolean;
  zIndex?: number;
}

const ShopLogoBadge = memo(
  ({
    shopId,
    size = 18,
    index = 0,
    style,
    highlighted = false,
    zIndex,
  }: ShopLogoBadgeProps) => {
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
              zIndex: zIndex ?? index + 1,
              backgroundColor: 'white',
              borderColor: highlighted ? PRIMARY_HEX : 'grey',
              borderWidth: highlighted ? 2 : 1,
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
