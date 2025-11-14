import { Percent, Tag } from 'lucide-react-native';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import FlippableCard from '~/src/components/flippable-card/flippable-card';
import { RefreshCw } from '~/src/lib/icons/RefreshCw';
import {
  type CartComparisonProductDto,
  CartComparisonProductType,
} from '~/src/network/model';

interface ProductListItemProps {
  product: CartComparisonProductDto;
  index: number;
  totalProducts: number;
  isFlipped: boolean;
  onFlip: () => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  index,
  totalProducts,
  isFlipped,
  onFlip,
}) => {
  const { t } = useTranslation('common');

  const {
    detail: {
      name,
      barcode,
      brand,
      unit: { normalized_amount: amount, normalized_unit: unit } = {},
      category: { id, image_url, name: categoryName } = {},
    } = {},
    price = 0,
    discount_price: { percentage_discount, price: discountPrice } = {},
    quantity = 1,
    type,
  } = product;

  const borderClass = index < totalProducts - 1 ? 'border-b border-border' : '';

  const displayFlippableCard =
    type &&
    (
      [
        CartComparisonProductType.CategoryReplacedWithProduct,
        CartComparisonProductType.ReplacedWithCategoryProduct,
      ] as CartComparisonProductType[]
    ).includes(type);

  const renderPriceSection = (currentPrice: number, showQuantity = true) => (
    <View className="items-end flex-shrink-0">
      {percentage_discount && price && (
        <View className="items-end mb-1">
          <Text className="text-xs text-muted-foreground line-through">
            {showQuantity ? (price * quantity).toFixed(2) : price.toFixed(2)} €
          </Text>
          {percentage_discount && (
            <View className="flex-row items-center bg-red-100 px-2 py-1 rounded-md mt-1">
              <Percent size={12} color="#DC2626" />
              <Text className="text-xs font-medium text-red-600 ml-1">
                -{percentage_discount}%
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="flex-row items-center">
        {percentage_discount && (
          <Tag size={14} color="#DC2626" className="mr-1" />
        )}
        <Text
          className={`text-base font-semibold ${percentage_discount ? 'text-red-600' : 'text-foreground'}`}
        >
          {showQuantity
            ? (currentPrice * quantity).toFixed(2)
            : currentPrice.toFixed(2)}{' '}
          €
        </Text>
      </View>

      {quantity > 1 && showQuantity && (
        <Text className="text-xs text-muted-foreground">
          {quantity} x {currentPrice.toFixed(2)} €
        </Text>
      )}
    </View>
  );

  const renderProductInfo = (productName?: string | null, showBrand = true) => (
    <View className="flex-1 pr-4">
      <View className="flex-row items-start justify-between">
        <Text
          className="text-base font-medium text-foreground leading-5 flex-1"
          numberOfLines={2}
        >
          {productName}
        </Text>
        {percentage_discount && (
          <View className="bg-red-50 px-2 py-1 rounded-md ml-2">
            <Text className="text-xs font-medium text-red-600">
              {t('discount')}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mt-1">
        <Text className="text-sm text-muted-foreground">
          {amount} {unit}
        </Text>
        {showBrand && brand && (
          <Text className="text-xs text-muted-foreground ml-2">• {brand}</Text>
        )}
      </View>
    </View>
  );

  const frontContent = (
    <View
      className={`p-4 bg-card ${borderClass} ${percentage_discount ? 'bg-red-50/30' : ''}`}
    >
      <View className="flex-row items-center justify-between min-h-[60px]">
        {renderProductInfo(name)}
        {renderPriceSection(price)}
        {displayFlippableCard && (
          <RefreshCw
            size={18}
            className="ml-4 mr-2 text-terciary flex-shrink-0"
          />
        )}
      </View>
    </View>
  );

  const backContent = displayFlippableCard ? (
    <View
      className={`p-4 bg-card ${borderClass} ${percentage_discount ? 'bg-red-50/30' : ''}`}
    >
      <View className="flex-row items-center justify-between min-h-[60px]">
        <View className="flex-row items-center flex-1 pr-4">
          {!!image_url && (
            <Image
              source={{ uri: image_url as string }}
              resizeMode="contain"
              className="w-8 h-8 mr-2"
            />
          )}
          <View className="flex-1">
            <View className="flex-row items-start justify-between">
              <Text
                className="text-base font-medium text-foreground flex-1 leading-5"
                numberOfLines={2}
              >
                {categoryName}
              </Text>
              {percentage_discount && (
                <View className="bg-red-50 px-2 py-1 rounded-md ml-2">
                  <Text className="text-xs font-medium text-red-600">
                    {t('discount')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {renderPriceSection(price)}
        <RefreshCw
          size={18}
          className="ml-4 mr-2 text-terciary flex-shrink-0"
        />
      </View>
    </View>
  ) : null;

  return (
    <FlippableCard
      key={barcode}
      frontContent={frontContent}
      backContent={backContent}
      isFlipped={isFlipped}
      onFlip={onFlip}
      disableFlipping={!displayFlippableCard}
    />
  );
};
