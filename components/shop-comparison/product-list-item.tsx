import React from "react";
import { Image, Text, View } from "react-native";
import FlippableCard from "~/components/flippable-card/flippable-card";
import { RefreshCw } from "~/lib/icons/RefreshCw";
import {
  HybridCartComparisonProductDto,
  HybridCartComparisonProductType,
} from "~/network/model";

interface ProductListItemProps {
  product: HybridCartComparisonProductDto;
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
  const {
    detail: {
      name,
      barcode,
      brand,
      unit,
      amount,
      category: { id, image_url, name: categoryName } = {},
    } = {},
    price = 0,
    quantity = 1,
    type,
  } = product;

  const borderClass =
    index < totalProducts - 1 ? "border-b border-gray-100" : "";

  const displayFlippableCard =
    type &&
    (
      [
        HybridCartComparisonProductType.CategoryReplacedWithProduct,
        HybridCartComparisonProductType.ReplacedWithCategoryProduct,
      ] as HybridCartComparisonProductType[]
    ).includes(type);

  const frontContent = (
    <View className={`p-4 bg-white ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900">{name}</Text>
          <Text className="text-sm text-gray-500">
            {amount} {unit}
          </Text>
        </View>

        <View className="items-end ml-4">
          <Text className="text-base font-semibold text-gray-900">
            {(price * quantity).toFixed(2)} €
          </Text>
          {quantity > 1 && (
            <Text className="text-xs text-gray-500">
              {quantity} x {price.toFixed(2)} €
            </Text>
          )}
        </View>
        <RefreshCw size={18} className="ml-4 mr-2 text-terciary" />
      </View>
    </View>
  );

  const backContent = displayFlippableCard ? (
    <View className={`p-4 bg-white ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {!!image_url && (
            <Image
              source={{ uri: image_url as string }}
              resizeMode="contain"
              className="w-8 h-8 mr-2"
            />
          )}
          <Text className="text-base font-medium text-gray-900">
            {categoryName}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="items-end ml-4">
            <Text className="text-base font-semibold text-gray-900">
              {(price * quantity).toFixed(2)} €
            </Text>
            {quantity > 1 && (
              <Text className="text-xs text-gray-500">
                {quantity} x {price.toFixed(2)} €
              </Text>
            )}
          </View>
          <RefreshCw size={18} className="ml-4 mr-2 text-terciary" />
        </View>
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
