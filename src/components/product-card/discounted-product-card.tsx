import clsx from 'clsx';
import { Image, type ImageSource } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { calculateDiscountPercentage } from '~/src/lib/number-utils';

cssInterop(Image, { className: 'style' });

import { USETRI_BLURHASH } from '../../lib/constants';
import type {
  ItemListGroupedByBarcodeDto,
  ShopItemDto,
  ShopPriceDto,
} from '../../network/model';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';
import { Badge } from '../ui/badge';
import PLACEHOLDER_PRODUCT_IMAGE from '~/assets/images/other/product_placeholder.jpg';

export interface IProductCardProps {
  product?: ItemListGroupedByBarcodeDto;
  shopsPrices?: (ShopItemDto | ShopPriceDto)[] | null;
  selectedShopId?: number | null;
  onPress?: (productId: number, categoryId: number) => void;
  className?: string;
}

const DiscountedProductCard = ({
  product,
  shopsPrices = [],
  selectedShopId,
  onPress,
  className,
}: IProductCardProps) => {
  const {
    detail: {
      id: productId,
      image_url,
      name,
      brand,
      unit: { normalized_amount: amount = '', normalized_unit: unit = '' } = {},
      category: { id: categoryId, image_url: categoryImageUrl } = {},
    } = {},
  } = { ...product };

  const availableShopIds = shopsPrices?.map(shop => Number(shop.shop_id)) || [];

  let imageSource: ImageSource | number = PLACEHOLDER_PRODUCT_IMAGE;
  if (categoryImageUrl) {
    imageSource = { uri: categoryImageUrl };
  }
  if (image_url) {
    imageSource = { uri: image_url };
  }

  const selectedShopPrice = selectedShopId
    ? shopsPrices?.find(shop => Number(shop.shop_id) === Number(selectedShopId))
    : undefined;

  const {
    discount_price,
    price,
    shop_id: lowestPriceShopId,
  } = selectedShopPrice ?? shopsPrices?.[0] ?? {};

  const percentageDiscount = calculateDiscountPercentage(
    Number(price),
    discount_price?.price,
  );
  const hasDiscount = !!discount_price && percentageDiscount;

  const renderPricing = () => {
    if (hasDiscount) {
      return (
        <View className="flex-row items-center space-x-1">
          <Text className="text-xs font-expose-bold text-o3 mr-1">
            {discount_price?.price} €
          </Text>
          <Text className="text-xs font-expose text-muted-foreground line-through">
            {price} €
          </Text>
        </View>
      );
    }

    return <Text className="text-sm font-expose-bold text-foreground">{price} €</Text>;
  };

  return (
    <Pressable
      className={clsx('flex-1', className)}
      onPress={() => onPress?.(Number(productId), Number(categoryId))}
    >
      <View className="bg-card rounded-xl p-2 shadow-sm border border-border mx-1">
        <View className="w-full h-32 rounded-lg relative">
          <Image
            source={imageSource}
            className="w-full h-32 rounded-lg"
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            placeholder={{
              blurhash: USETRI_BLURHASH,
            }}
          />

          <View className="absolute bottom-4 flex-row gap-x-2 mt-1">
            {availableShopIds?.map((retailer, index) =>
              retailer ? (
                <ShopLogoBadge
                  key={retailer}
                  shopId={retailer}
                  size={20}
                  index={index}
                  zIndex={availableShopIds.length - index}
                  highlighted={
                    availableShopIds.length > 1 &&
                    (selectedShopId
                      ? retailer === Number(selectedShopId)
                      : retailer === Number(lowestPriceShopId))
                  }
                />
              ) : null,
            )}
          </View>
        </View>

        <Badge className="absolute top-2 left-2 bg-secondary">
          <Text className="text-xs font-expose text-foreground">{`${amount} ${unit}`}</Text>
        </Badge>

        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-warning">
            <Text className="text-xs font-expose-bold text-foreground">
              -{percentageDiscount}%
            </Text>
          </Badge>
        )}

        <View className="mt-2 space-y-1">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs font-expose text-muted-foreground" numberOfLines={1}>
                {brand}
              </Text>
              <Text
                className="text-sm font-expose text-card-foreground"
                numberOfLines={1}
              >
                {name}
              </Text>
              {renderPricing()}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default DiscountedProductCard;
