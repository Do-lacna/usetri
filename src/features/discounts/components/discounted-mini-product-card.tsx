import type React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';
import { COLORS } from '~/src/lib/constants';
import { calculateDiscountPercentage } from '~/src/lib/number-utils';
import type { ShopItemDto, ShopPriceDto } from '~/src/network/model';
import PLACEHOLDER_PRODUCT_IMAGE from '~/assets/images/other/product_placeholder.jpg';

// Types
interface Shop {
  id: string;
  name: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  availableShops: Shop[];
}

interface ProductCardProps {
  product: ShopItemDto;
  shopsPrices?: ShopPriceDto[] | null;
  onPress?: (productId: number) => void;
}

const DiscountedMiniProductCard: React.FC<ProductCardProps> = ({
  product,
  shopsPrices,
  onPress,
}) => {
  const {
    price,
    detail: { id: productId, image_url, name } = {},
    shop_id,
  } = product;

  const lowestPrice = shopsPrices?.[0]?.price ?? 0;
  const lowestDiscountedPrice = shopsPrices?.[0]?.discount_price?.price ?? 0;

  return (
    <Pressable
      className="rounded-lg p-2 mx-2 shadow-sm border bg-v3 border-border w-32"
      onPress={() => onPress?.(Number(productId))}
    >
      {/* Discount Badge — g1 yellow */}
      <View className="absolute top-2 right-2 bg-g1 rounded-full px-2 py-1 z-10">
        <Text className="text-foreground text-xs font-expose-bold">
          -
          {calculateDiscountPercentage(
            Number(lowestPrice),
            lowestDiscountedPrice,
          )}
          %
        </Text>
      </View>

      {/* Product Image */}
      <View className="w-full h-16 rounded-lg relative">
        <Image
          source={image_url ? { uri: image_url } : PLACEHOLDER_PRODUCT_IMAGE}
          className="w-full h-16 rounded-md mb-2"
          resizeMode="cover"
        />

        <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
          {/* {TODO add all available shops from BE} */}
          {shopsPrices?.map(({ shop_id }, index) => (
            <View
              key={shop_id}
              style={{ width: 15, height: 15, borderRadius: 50 }}
            >
              <ShopLogoBadge
                shopId={Number(shop_id)}
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 50,
                  position: 'absolute',
                  right: index * 12,
                  zIndex: index + 1,
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.n5,
                  borderWidth: 1,
                }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Product Name */}
      <Text
        className="text-card-foreground text-xs font-expose-medium mb-1 leading-4"
        numberOfLines={1}
      >
        {name}
      </Text>

      {/* Price Information */}
      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground text-xs line-through font-sans">
          {lowestPrice?.toFixed(2)} €
        </Text>
        <Text className="text-o3 text-xs font-expose-bold">
          {lowestDiscountedPrice?.toFixed(2)} €
        </Text>
      </View>
    </Pressable>
  );
};

export default DiscountedMiniProductCard;
