import type React from "react";
import { Image, Text, View } from "react-native";
import FlippableCard from "~/components/flippable-card/flippable-card";
import { RefreshCw } from "~/lib/icons/RefreshCw";
import {
  type HybridCartComparisonProductDto,
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
      unit: { normalized_amount: amount, normalized_unit: unit } = {},
      category: { id, image_url, name: categoryName } = {},
    } = {},
    price = 0,
    quantity = 1,
    type,
  } = product;

  const borderClass = index < totalProducts - 1 ? "border-b border-border" : "";

  const displayFlippableCard =
    type &&
    (
      [
        HybridCartComparisonProductType.CategoryReplacedWithProduct,
        HybridCartComparisonProductType.ReplacedWithCategoryProduct,
      ] as HybridCartComparisonProductType[]
    ).includes(type);

  const frontContent = (
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center justify-between min-h-[60px]">
        <View className="flex-1 pr-4">
          <Text
            className="text-base font-medium text-foreground leading-5"
            numberOfLines={2}
          >
            {name}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {amount} {unit}
          </Text>
        </View>

        <View className="items-end flex-shrink-0">
          <Text className="text-base font-semibold text-foreground">
            {(price * quantity).toFixed(2)} €
          </Text>
          {quantity > 1 && (
            <Text className="text-xs text-muted-foreground">
              {quantity} x {price.toFixed(2)} €
            </Text>
          )}
        </View>
        <RefreshCw
          size={18}
          className="ml-4 mr-2 text-terciary flex-shrink-0"
        />
      </View>
    </View>
  );

  const backContent = displayFlippableCard ? (
    <View className={`p-4 bg-card ${borderClass}`}>
      <View className="flex-row items-center justify-between min-h-[60px]">
        <View className="flex-row items-center flex-1 pr-4">
          {!!image_url && (
            <Image
              source={{ uri: image_url as string }}
              resizeMode="contain"
              className="w-8 h-8 mr-2"
            />
          )}
          <Text
            className="text-base font-medium text-foreground flex-1 leading-5"
            numberOfLines={2}
          >
            {categoryName}
          </Text>
        </View>

        <View className="items-end flex-shrink-0">
          <Text className="text-base font-semibold text-foreground">
            {(price * quantity).toFixed(2)} €
          </Text>
          {quantity > 1 && (
            <Text className="text-xs text-muted-foreground">
              {quantity} x {price.toFixed(2)} €
            </Text>
          )}
        </View>
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
