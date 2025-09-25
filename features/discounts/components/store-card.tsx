import React from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import type { DiscountStatsDto, ShopExtendedDto } from "../../../network/model";
import { getShopCoverImage } from "../../../utils/logo-utils";
import {
  getStoreDiscountsCount,
  getStoreDisplayName,
} from "../utils/store-utils";

interface StoreCardProps {
  store: ShopExtendedDto;
  index: number;
  isActive: boolean;
  stats: DiscountStatsDto[];
  onPress: (storeId: number, index: number) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  index,
  isActive,
  stats,
  onPress,
}) => {
  const { t } = useTranslation();
  const discountCount = getStoreDiscountsCount(Number(store?.id), stats);
  const storeImage = getShopCoverImage(Number(store?.id));

  return (
    <TouchableOpacity
      key={store.id}
      onPress={() => onPress(Number(store?.id), index)}
      className={`w-80 h-48 mx-2 rounded-xl overflow-hidden ${
        isActive
          ? "opacity-100 scale-100 shadow-lg"
          : "opacity-60 scale-95 shadow-sm"
      }`}
    >
      <ImageBackground
        source={storeImage}
        className="flex-1"
        resizeMode="cover"
      >
        <View
          className={`absolute inset-0 ${
            isActive ? "bg-black/30" : "bg-black/50"
          }`}
        />

        <View className="absolute bottom-3 left-4">
          <Text
            className={`font-bold ${
              isActive ? "text-white text-lg" : "text-white/80 text-base"
            }`}
          >
            {getStoreDisplayName(store.name)}
          </Text>
          {discountCount > 0 && (
            <Text
              className={`mt-1 ${
                isActive ? "text-white/90 text-sm" : "text-white/70 text-xs"
              }`}
            >
              {t("discounts.discountsCount", {
                count: discountCount,
              })}
            </Text>
          )}
        </View>

        {isActive && (
          <>
            <View className="absolute inset-0 border-4 border-primary rounded-xl" />
            <View className="absolute top-3 right-3 w-4 h-4 bg-primary rounded-full shadow-lg" />
          </>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};
