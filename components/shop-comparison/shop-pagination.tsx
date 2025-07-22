import React from "react";
import { TouchableOpacity, View } from "react-native";
import { HybridCartComparisonDto } from "~/network/model";

interface ShopPaginationProps {
  carts: HybridCartComparisonDto[] | null;
  currentCartIndex: number;
  onGoToShop: (index: number) => void;
  areMoreCartsAvailable: boolean;
}

export const ShopPagination: React.FC<ShopPaginationProps> = ({
  carts,
  currentCartIndex,
  onGoToShop,
  areMoreCartsAvailable,
}) => {
  if (!areMoreCartsAvailable) return null;

  return (
    <View className="flex-row justify-center space-x-2 mb-4">
      {carts?.map(({ shop }, index) => (
        <TouchableOpacity
          key={shop?.id}
          onPress={() => onGoToShop(index)}
          className={`w-3 h-3 rounded-full mr-1 ${
            index === currentCartIndex ? "bg-terciary" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
};
