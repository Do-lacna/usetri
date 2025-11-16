import clsx from 'clsx';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../../../lib/constants';
import { calculateDiscountPercentage } from '~/src/lib/number-utils';
import type { ShopItemDto, ShopPriceDto } from '~/src/network/model';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';

cssInterop(Image, { className: 'style' });

export interface IProductCardProps {
  product?: ShopItemDto;
  shopsPrices?: ShopPriceDto[] | null;
  onPress?: (productId: number, categoryId: number) => void;
  className?: string;
  isSelected?: boolean;
}

const SuggestedProductCard = ({
  product,
  shopsPrices,
  onPress,
  className,
  isSelected,
}: IProductCardProps) => {
  const {
    detail: {
      id: productId,
      name,
      brand,
      barcode,
      unit: { normalized_amount: amount = '', normalized_unit: unit = '' } = {},
      category: { id: categoryId, image_url: categoryImageUrl } = {},
      image_url,
    } = {},
  } = { ...product };

  const lowestPrice = shopsPrices?.[0]?.price ?? 0;
  const lowestDiscountedPrice = shopsPrices?.[0]?.discount_price?.price ?? 0;
  const hasDiscount = lowestDiscountedPrice > 0 && lowestDiscountedPrice < lowestPrice;
  const displayPrice = hasDiscount ? lowestDiscountedPrice : (shopsPrices?.[0]?.actual_price ?? 0);

  return (
    <Pressable
      className={clsx('w-32 mr-4 flex-1', className)}
      onPress={() => onPress?.(Number(productId), Number(categoryId))}
    >
      <View
        className={clsx(
          'bg-card rounded-xl p-2 shadow-sm shadow-foreground/10 border border-border',
          isSelected ? 'border-2 border-primary' : '',
        )}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <View className="absolute top-2 right-2 bg-discount rounded-full px-2 py-1 z-10">
            <Text className="text-discount-foreground text-xs font-bold">
              -
              {calculateDiscountPercentage(
                lowestPrice,
                lowestDiscountedPrice,
              )}
              %
            </Text>
          </View>
        )}

        <View className="w-full h-24 rounded-lg relative">
          <Image
            source={{
              uri: image_url ?? categoryImageUrl ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-24 rounded-lg"
          />
          <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
            {shopsPrices?.map(({ shop_id }, index) =>
              shop_id ? (
                <ShopLogoBadge
                  key={shop_id}
                  shopId={shop_id}
                  size={18}
                  index={index}
                />
              ) : null,
            )}
          </View>
        </View>

        <View className="mt-2 space-y-1">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {brand}
              </Text>
              <Text
                className="text-sm font-medium text-card-foreground"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {amount} {unit}
              </Text>
            </View>
            {hasDiscount ? (
              <View className="flex-col items-end">
                <Text className="text-xs text-muted-foreground line-through">
                  {lowestPrice.toFixed(2)} €
                </Text>
                <Text className="text-sm font-bold text-discount">
                  {displayPrice.toFixed(2)} €
                </Text>
              </View>
            ) : (
              <Text className="text-sm font-bold text-card-foreground">
                {displayPrice} €
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SuggestedProductCard;
