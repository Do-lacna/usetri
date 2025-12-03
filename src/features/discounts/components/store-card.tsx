import React from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PRIMARY_HEX } from "~/src/lib/constants";
import type { DiscountStatsDto, ShopExtendedDto } from "~/src/network/model";
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
  cardWidth: number;
  animatedHeight?: Animated.AnimatedInterpolation<number>;
}

const EXPANDED_HEIGHT = 240;
const COLLAPSED_HEIGHT = 90;

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  index,
  isActive,
  stats,
  onPress,
  cardWidth,
  animatedHeight,
}) => {
  const { t } = useTranslation();
  const discountCount = getStoreDiscountsCount(Number(store?.id), stats);
  const storeImage = getShopCoverImage(Number(store?.id));

  // Create collapse interpolation (0 = expanded, 1 = collapsed)
  const collapse = animatedHeight
    ? animatedHeight.interpolate({
        inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : new Animated.Value(0);

  // Interpolate internal UI elements based on collapse value
  const titleFontSize = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [isActive ? 24 : 20, isActive ? 16 : 14],
  });

  const contentPaddingBottom = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 6],
  });

  const contentPaddingLeft = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const discountTextOpacity = collapse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const discountTextFontSize = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [isActive ? 14 : 12, 10],
  });

  const cardHeight = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [192, 80],
  });

  const indicatorSize = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 10],
  });

  const indicatorTopPosition = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 6],
  });

  const indicatorRightPosition = collapse.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 8],
  });

  return (
    <Animated.View style={{ height: cardHeight }}>
      <TouchableOpacity
        key={store.id}
        onPress={() => onPress(Number(store?.id), index)}
        style={[
          {
            width: cardWidth,
            height: "100%",
            marginHorizontal: 8,
            borderRadius: 12,
            transform: [{ scale: isActive ? 1 : 0.92 }],
            opacity: isActive ? 1 : 0.7,
          },
          isActive && {
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          !isActive && {
            elevation: 2,
            shadowColor: "#000",
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
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isActive
                ? "rgba(0, 0, 0, 0.3)"
                : "rgba(0, 0, 0, 0.5)",
              borderRadius: 12,
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              bottom: contentPaddingBottom,
              left: contentPaddingLeft,
            }}
          >
            <Animated.Text
              style={{
                fontWeight: "bold",
                color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                fontSize: titleFontSize,
              }}
            >
              {getStoreDisplayName(store.name)}
            </Animated.Text>
            {discountCount > 0 && (
              <Animated.Text
                style={{
                  marginTop: 4,
                  color: isActive
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.7)",
                  fontSize: discountTextFontSize,
                  opacity: discountTextOpacity,
                }}
              >
                {t("discounts.discountsCount", {
                  count: discountCount,
                })}
              </Animated.Text>
            )}
          </Animated.View>

          {isActive && (
            <>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderWidth: 4,
                  borderColor: PRIMARY_HEX,
                  borderRadius: 12,
                  pointerEvents: "none",
                }}
              />
              <Animated.View
                style={{
                  position: "absolute",
                  top: indicatorTopPosition,
                  right: indicatorRightPosition,
                  width: indicatorSize,
                  height: indicatorSize,
                  backgroundColor: PRIMARY_HEX,
                  borderRadius: collapse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 5],
                  }),
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              />
            </>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};
