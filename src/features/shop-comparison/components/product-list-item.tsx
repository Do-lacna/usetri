import type React from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, Text, View } from 'react-native';
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
  const spinValue = useRef(new Animated.Value(0)).current;

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
    original_product_detail,
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

  // Spin animation for replacement icon
  useEffect(() => {
    if (displayFlippableCard) {
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [displayFlippableCard]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderPriceSection = (currentPrice: number, showQuantity = true) => (
    <View className="items-end flex-shrink-0">
      {percentage_discount && price && (
        <Text className="text-xs text-muted-foreground line-through mb-1">
          {showQuantity ? (price * quantity).toFixed(2) : price.toFixed(2)} €
        </Text>
      )}

      <View className="flex-row items-center">
        <Text
          className={`text-base font-semibold ${percentage_discount ? 'text-red-600' : 'text-foreground'}`}
        >
          {showQuantity
            ? (currentPrice * quantity).toFixed(2)
            : currentPrice.toFixed(2)}{' '}
          €
        </Text>
        {percentage_discount && (
          <View className="bg-red-100 px-1.5 py-0.5 rounded ml-2">
            <Text className="text-xs font-medium text-red-600">
              -{percentage_discount}%
            </Text>
          </View>
        )}
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
      <Text
        className="text-base font-medium text-foreground leading-5"
        numberOfLines={2}
      >
        {productName}
      </Text>

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
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center justify-between min-h-[60px]">
        {renderProductInfo(name)}
        {renderPriceSection(price)}
        {displayFlippableCard && (
          <Animated.View
            style={{ transform: [{ rotate: spin }] }}
            className="ml-4 mr-2 rounded-full p-1.5 flex-shrink-0"
          >
            <RefreshCw size={16} className="text-terciary" />
          </Animated.View>
        )}
      </View>
    </View>
  );

  const backContent = displayFlippableCard ? (
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center justify-between min-h-[60px]">
        {original_product_detail ? (
          // Show original product when it was replaced with another product
          <>
            <View className="flex-1 pr-4">
              <Text
                className="text-base font-medium text-foreground leading-5"
                numberOfLines={2}
              >
                {original_product_detail.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <Text className="text-sm text-muted-foreground">
                  {original_product_detail.unit?.normalized_amount}{' '}
                  {original_product_detail.unit?.normalized_unit}
                </Text>
                {original_product_detail.brand && (
                  <Text className="text-xs text-muted-foreground ml-2">
                    • {original_product_detail.brand}
                  </Text>
                )}
              </View>
            </View>
            {renderPriceSection(price, false)}
          </>
        ) : (
          // Show category when it was replaced with a category product
          <>
            <View className="flex-row items-center flex-1 pr-4">
              {!!image_url && (
                <Image
                  source={{ uri: image_url as string }}
                  resizeMode="contain"
                  className="w-8 h-8 mr-2"
                />
              )}
              <View className="flex-1">
                <Text
                  className="text-base font-medium text-foreground leading-5"
                  numberOfLines={2}
                >
                  {categoryName}
                </Text>
              </View>
            </View>
            {renderPriceSection(price)}
          </>
        )}
        <Animated.View
          style={{ transform: [{ rotate: spin }] }}
          className="ml-4 mr-2 rounded-full p-1.5 flex-shrink-0"
        >
          <RefreshCw size={16} className="text-terciary" />
        </Animated.View>
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
