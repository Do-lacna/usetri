import clsx from 'clsx';
import { Image, Pressable, Text, View } from 'react-native';
import { calculateDiscountPercentage } from '~/lib/number-utils';
import { PLACEHOLDER_PRODUCT_IMAGE } from '../../lib/constants';
import type {
  ItemListGroupedByBarcodeDto,
  ShopItemDto,
} from '../../network/model';
import ShopLogoBadge from '../shop-logo-badge';
import { Badge } from '../ui/badge';

export interface IProductCardProps {
  product?: ItemListGroupedByBarcodeDto;
  shopsPrices?: ShopItemDto[] | null; // List of prices from different shops
  onPress?: (barcode: string, categoryId: number) => void;
  className?: string;
}

const DiscountedProductCard = ({
  product,
  shopsPrices = [],
  onPress,
  className,
}: IProductCardProps) => {
  const {
    detail: {
      image_url,
      name,
      brand,
      barcode,
      unit: { normalized_amount: amount = '', normalized_unit: unit = '' } = {},
      category: { id: categoryId, image_url: categoryImageUrl } = {},
    } = {},
  } = { ...product };

  const availableShopIds = shopsPrices?.map(shop => Number(shop.shop_id)) || [];

  const { discount_price, price } = shopsPrices?.[0] || {};

  const percentageDiscount = calculateDiscountPercentage(
    Number(price),
    discount_price?.price,
  );
  const hasDiscount = !!discount_price && percentageDiscount;

  const renderPricing = () => {
    if (hasDiscount) {
      return (
        <View className="flex-row items-center space-x-1">
          <Text className="text-xs font-bold text-red-600 mr-1">
            {discount_price?.price} €
          </Text>
          <Text className="text-xs text-muted-foreground line-through">
            {price} €
          </Text>
        </View>
      );
    }

    // Regular price when no discount
    return <Text className="text-sm font-bold text-foreground">{price} €</Text>;
  };

  return (
    <Pressable
      className={clsx('w-40 mr-20 last:mr-0 flex-1', className)}
      onPress={() => onPress?.(String(barcode), Number(categoryId))}
    >
      <View className="bg-card rounded-xl p-2 shadow-sm shadow-foreground/10">
        <View className="w-full h-32 rounded-lg relative">
          <Image
            source={{
              uri: image_url
                ? image_url
                : categoryImageUrl || PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-32 rounded-lg"
            resizeMode="contain"
          />

          <View className="absolute bottom-4 flex-row gap-x-2 mt-1">
            {availableShopIds?.map((retailer, index) =>
              retailer ? (
                <ShopLogoBadge
                  key={retailer}
                  shopId={retailer}
                  size={20}
                  index={index}
                />
              ) : null,
            )}
          </View>
        </View>

        <Badge className="absolute top-2 bg-accent">
          <Text className="text-xs text-accent-foreground">{`${amount} ${unit}`}</Text>
        </Badge>

        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-discount">
            <Text className="text-xs text-discount-foreground font-semibold">
              -{percentageDiscount}%
            </Text>
          </Badge>
        )}

        {/* Product Info */}
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
              {renderPricing()}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default DiscountedProductCard;
