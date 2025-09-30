import React from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import type { DiscountStatsDto, ShopExtendedDto } from "../../../network/model";
import { getShopCoverImage } from "../../../utils/logo-utils";
import {
  getStoreDiscountsCount,
  getStoreDisplayName,
} from "../utils/store-utils";
import { PRIMARY_HEX } from "~/lib/constants";

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
      style={[
        {
          width: 320,
          height: 192,
          marginHorizontal: 8,
          borderRadius: 12,
          // Remove overflow: 'hidden' to prevent border clipping
          transform: [{ scale: isActive ? 1 : 0.95 }],
          opacity: isActive ? 1 : 0.6,
        },
        isActive && {
          elevation: 8, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        !isActive && {
          elevation: 2, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      ]}
    >
      <ImageBackground
        source={storeImage}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 12 }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isActive ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
            borderRadius: 12,
          }}
        />

        <View style={{ position: 'absolute', bottom: 12, left: 16 }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
              fontSize: isActive ? 18 : 16,
            }}
          >
            {getStoreDisplayName(store.name)}
          </Text>
          {discountCount > 0 && (
            <Text
              style={{
                marginTop: 4,
                color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
                fontSize: isActive ? 14 : 12,
              }}
            >
              {t("discounts.discountsCount", {
                count: discountCount,
              })}
            </Text>
          )}
        </View>

        {isActive && (
          <>
            <View 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderWidth: 4,
                borderColor: PRIMARY_HEX, // primary color
                borderRadius: 12,
                pointerEvents: 'none', // Prevent touch interference
              }}
            />
            <View 
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 16,
                height: 16,
                backgroundColor: PRIMARY_HEX, // primary color
                borderRadius: 8,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            />
          </>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};
