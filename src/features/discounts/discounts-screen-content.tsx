import type React from "react";
import { useRef } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetDiscountsStatistics } from "~/src/network/query/query";
import DiscountList from "./components/discount-list";
import { StoreCarousel } from "./components/store-carousel";
import { useStoreSelection } from "./hooks/use-store-selection";
import { getStoreDisplayName } from "./utils/store-utils";

export const DiscountsScreenContent: React.FC = () => {
  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();

  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  } = useStoreSelection(scrollY);

  const SCROLL_DISTANCE = 150;
  const MIN_HEIGHT = 90;
  const MAX_HEIGHT = 240;

  const carouselHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <StoreCarousel
        shops={sortedShops}
        activeStoreId={activeStoreId}
        stats={stats || []}
        onStoreSelect={handleStoreSelect}
        onSnapToItem={handleSnapToItem}
        animatedHeight={carouselHeight}
        scrollY={scrollY}
      />

      {!!activeStore && (
        <View className="flex-1 bg-background">
          <View className="px-4 py-2">
            <Text className="text-2xl font-bold text-foreground">
              Zľavy v {getStoreDisplayName(activeStore.name)}
            </Text>
          </View>
          <DiscountList
            key={activeStoreId}
            shop={activeStore}
            onScroll={scrollY}
          />
        </View>
      )}

      <View className="bg-card px-4 py-3 border-t border-border">
        <Text className="text-center text-xs text-muted-foreground">
          Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
        </Text>
      </View>
    </SafeAreaView>
  );
};
