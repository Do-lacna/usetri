import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "../../components/discounts/discount-list";
import {
  useGetDiscountsStatistics,
  useGetShops,
} from "../../network/query/query";
import { StoreCarousel } from "./components/store-carousel";
import { useStoreSelection } from "./hooks/use-store-selection";
import { getStoreDisplayName } from "./utils/store-utils";

export const DiscountsScreenContent: React.FC = () => {
  const { data: { shops } = {}, isLoading: areShopsLoading } = useGetShops();
  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();

  const {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  } = useStoreSelection(shops || undefined, stats || []);

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
      />

      {!!activeStore && (
        <View className="flex-1 bg-background">
          <View className="px-4 py-2">
            <Text className="text-2xl font-bold text-foreground">
              Zľavy v {getStoreDisplayName(activeStore.name)}
            </Text>
          </View>
          <DiscountList shop={activeStore} />
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
