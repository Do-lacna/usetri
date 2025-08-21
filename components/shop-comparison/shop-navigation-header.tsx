import type React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { isArrayNotEmpty } from "~/lib/utils";
import type { HybridCartComparisonDto, ShopExtendedDto } from "~/network/model";
import { getShopLogo } from "~/utils/logo-utils";

interface ShopNavigationHeaderProps {
  currentShop?: ShopExtendedDto;
  carts: HybridCartComparisonDto[] | null;
  onPrevShop: () => void;
  onNextShop: () => void;
  areMoreCartsAvailable: boolean;
}

export const ShopNavigationHeader: React.FC<ShopNavigationHeaderProps> = ({
  currentShop,
  carts,
  onPrevShop,
  onNextShop,
  areMoreCartsAvailable,
}) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      {areMoreCartsAvailable && (
        <TouchableOpacity
          onPress={onPrevShop}
          className="p-2 rounded-full bg-card shadow-sm border border-border"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ArrowLeft size={20} className="text-foreground" />
        </TouchableOpacity>
      )}

      <View className="flex-1 items-center">
        <Image
          {...getShopLogo(currentShop?.id as any)}
          className="w-16 h-16 rounded-full"
          resizeMode="contain"
        />
      </View>

      {areMoreCartsAvailable && (
        <TouchableOpacity
          onPress={onNextShop}
          className="p-2 rounded-full bg-card shadow-sm border border-border"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ArrowRight size={20}  className="text-foreground"/>
        </TouchableOpacity>
      )}
    </View>
  );
};
