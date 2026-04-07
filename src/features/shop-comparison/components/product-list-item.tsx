import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import FlippableCard from '~/src/components/flippable-card/flippable-card';
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
  const { t } = useTranslation();

  const {
    detail: {
      name,
      id: productId,
      brand,
      unit: { normalized_amount: amount, normalized_unit: unit } = {},
      category: { image_url, name: categoryName } = {},
    } = {},
    price = 0,
    actual_price = 0,
    discount_price: { percentage_discount, price: discountPrice } = {},
    quantity = 1,
    type,
    original_product_detail,
  } = product;

  const borderClass = index < totalProducts - 1 ? 'border-b border-border' : '';

  const finalPrice = actual_price || price;
  const hasDiscount = !!percentage_discount && !!discountPrice;

  const displayFlippableCard =
    type &&
    (
      [
        CartComparisonProductType.CategoryReplacedWithProduct,
        CartComparisonProductType.ReplacedWithCategoryProduct,
      ] as CartComparisonProductType[]
    ).includes(type);

  const originalName = original_product_detail?.name || categoryName;
  const isFromCategory =
    type === CartComparisonProductType.CategoryReplacedWithProduct;

  const renderPriceSection = (currentPrice: number, showQuantity = true) => (
    <View className="items-end flex-shrink-0">
      {hasDiscount && (
        <Text className="text-xs font-expose text-muted-foreground line-through mb-1">
          {showQuantity ? (price * quantity).toFixed(2) : price.toFixed(2)} €
        </Text>
      )}

      <View className="flex-row items-center">
        <Text
          className={`text-base font-expose-bold ${hasDiscount ? 'text-discount' : 'text-foreground'}`}
        >
          {showQuantity
            ? (currentPrice * quantity).toFixed(2)
            : currentPrice.toFixed(2)}{' '}
          €
        </Text>
        {hasDiscount && (
          <View className="bg-discount-light px-1.5 py-0.5 rounded ml-2">
            <Text className="text-xs font-expose text-discount">
              -{percentage_discount}%
            </Text>
          </View>
        )}
      </View>

      {quantity > 1 && showQuantity && (
        <Text className="text-xs font-expose text-muted-foreground">
          {quantity} x {currentPrice.toFixed(2)} €
        </Text>
      )}
    </View>
  );

  const renderProductInfo = (productName?: string | null, showBrand = true) => (
    <View className="flex-1 pr-4">
      <Text
        className="text-base font-expose text-foreground leading-5"
        numberOfLines={2}
      >
        {productName}
      </Text>

      <View className="flex-row items-center mt-1">
        <Text className="text-sm font-expose text-muted-foreground">
          {amount} {unit}
        </Text>
        {showBrand && brand && (
          <Text className="text-xs font-expose text-muted-foreground ml-2">
            • {brand}
          </Text>
        )}
      </View>
    </View>
  );

  const frontContent = (
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center justify-between min-h-[60px]">
        {renderProductInfo(name)}
        {renderPriceSection(finalPrice)}
      </View>
      {displayFlippableCard && originalName && (
        <View className="flex-row items-center mt-2 pt-2 border-t border-border/50">
          <View
            className={`px-1.5 py-0.5 rounded mr-2 ${isFromCategory ? 'bg-primary/15' : 'bg-o1/15'}`}
          >
            <Text
              className={`text-[10px] font-expose-bold ${isFromCategory ? 'text-primary' : 'text-o1'}`}
            >
              {t(
                isFromCategory
                  ? 'shop_comparison.from_category'
                  : 'shop_comparison.replaced',
              )}
            </Text>
          </View>
          <Text
            className="text-xs font-expose text-muted-foreground flex-1"
            numberOfLines={1}
          >
            {isFromCategory
              ? categoryName
              : t('shop_comparison.originally', { name: originalName })}
          </Text>
        </View>
      )}
    </View>
  );

  const backContent = displayFlippableCard ? (
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center mb-2">
        <View className="px-1.5 py-0.5 bg-muted rounded">
          <Text className="text-[10px] font-expose-bold text-muted-foreground">
            {t('shop_comparison.original_product')}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between min-h-[60px]">
        {original_product_detail ? (
          <>
            <View className="flex-1 pr-4">
              <Text
                className="text-base font-expose text-foreground leading-5"
                numberOfLines={2}
              >
                {original_product_detail.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <Text className="text-sm font-expose text-muted-foreground">
                  {original_product_detail.unit?.normalized_amount}{' '}
                  {original_product_detail.unit?.normalized_unit}
                </Text>
                {original_product_detail.brand && (
                  <Text className="text-xs font-expose text-muted-foreground ml-2">
                    • {original_product_detail.brand}
                  </Text>
                )}
              </View>
            </View>
            {renderPriceSection(price, false)}
          </>
        ) : (
          <>
            <View className="flex-row items-center flex-1 pr-4">
              {!!image_url && (
                <Image
                  source={{ uri: image_url }}
                  resizeMode="contain"
                  className="w-8 h-8 mr-2"
                />
              )}
              <View className="flex-1">
                <Text
                  className="text-base font-expose text-foreground leading-5"
                  numberOfLines={2}
                >
                  {categoryName}
                </Text>
              </View>
            </View>
            {renderPriceSection(price)}
          </>
        )}
      </View>
    </View>
  ) : null;

  return (
    <FlippableCard
      key={productId}
      frontContent={frontContent}
      backContent={backContent}
      isFlipped={isFlipped}
      onFlip={onFlip}
      disableFlipping={!displayFlippableCard}
    />
  );
};
