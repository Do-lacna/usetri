import type React from "react";
import { Image, Text, View } from "react-native";
import type { HybridCartComparisonProductDto } from "~/network/model";

interface MissingProductCardProps {
  product: HybridCartComparisonProductDto;
  index: number;
  totalProducts: number;
  shopName?: string; // Optional shop name to display which shop is missing the product
}

export const MissingProductCard: React.FC<MissingProductCardProps> = ({
  product,
  index,
  totalProducts,
  shopName,
}) => {
  const {
    detail: {
      name,
      brand,
      unit: { normalized_amount: amount, normalized_unit: unit } = {},
      category: { id, image_url, name: categoryName } = {},
    } = {},
    price = 0,
    quantity = 1,
  } = product ?? {};

  const borderClass = index < totalProducts - 1 ? "border-b border-border" : "";

  return (
    <View className={`p-4 bg-destructive/10 ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            {/* Missing indicator icon */}
            <View className="w-3 h-3 bg-destructive rounded-full mr-2" />
            <Text className="text-base font-medium text-muted-foreground line-through">
              {name}
            </Text>
          </View>

          <Text className="text-sm text-muted-foreground ml-5">
            {amount} {unit}
          </Text>

          {/* Category fallback if available */}
          {categoryName && (
            <View className="flex-row items-center mt-2 ml-5">
              {!!image_url && (
                <Image
                  source={{ uri: image_url as string }}
                  resizeMode="contain"
                  className="w-6 h-6 mr-2"
                />
              )}
              <Text className="text-sm text-primary">
                Kategória : {categoryName}
              </Text>
            </View>
          )}

          {/* Shop name if provided */}
          {shopName && (
            <Text className="text-xs text-destructive mt-1 ml-5">
              Nedostupné v {shopName}
            </Text>
          )}
        </View>

        <View className="items-end ml-4">
          <View className="bg-destructive/20 px-2 py-1 rounded">
            <Text className="text-sm font-medium text-destructive">
              Nedostupné
            </Text>
          </View>

          {/* Original price for reference */}
          <Text className="text-sm text-muted-foreground line-through mt-1">
            {(price * quantity).toFixed(2)} €
          </Text>

          {quantity > 1 && (
            <Text className="text-xs text-muted-foreground line-through">
              {quantity} x {price.toFixed(2)} €
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
