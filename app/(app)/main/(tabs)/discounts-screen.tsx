import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "../../../../components/discounts/discount-list";
import DiscountMiniProductsList from "../../../../components/discounts/discount-mini-products-list";
import StoreLogo from "../../../../components/store-logo/store-logo";
import { isArrayNotEmpty } from "../../../../lib/utils";
import type {
  DiscountStatsDto,
  ShopExtendedDto,
} from "../../../../network/model";
import {
  useGetDiscountsStatistics,
  useGetShops,
} from "../../../../network/query/query";

const GroceryDiscountsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { data: { shops } = {}, isLoading: areShopsLoading } = useGetShops();

  const [activeStoreId, setActiveStoreId] = useState<number | null>(null); // Default to first store if available

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  ); // Fallback to first store if none is selected

  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();

  const getStoreDiscountsCount = (
    storeId: number,
    stats: DiscountStatsDto[] | null
  ) => {
    return (
      stats?.find((stat) => stat.shop_id === storeId)?.valid_discounts_count ||
      0
    );
  };

  React.useEffect(() => {
    if (isArrayNotEmpty(stats) && isArrayNotEmpty(shops) && !activeStoreId) {
      const sortedShops = shops?.sort(
        ({ id: firstStoreId = 0 }, { id: secondStoreId = 0 }) =>
          getStoreDiscountsCount(secondStoreId, stats) -
          getStoreDiscountsCount(firstStoreId, stats)
      );
      setActiveStoreId(Number(sortedShops?.[0]?.id));
    }
  }, [shops, stats, activeStoreId]);

  const renderStoreTab = (store: ShopExtendedDto) => {
    const isActive = store?.id === activeStoreId;

    return (
      <TouchableOpacity
        key={store.id}
        onPress={() => setActiveStoreId(Number(store?.id))}
        className={`flex-1 items-center py-1 mx-1 rounded-xl bg-muted border-2 ${
          isActive ? "border-primary" : "border-border"
        }`}
      >
        <StoreLogo storeId={store?.id} />
        <Text
          className={`text-xs font-medium ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {store.name}
        </Text>
        {/* <Text
          className={`text-xs ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {t("discounts", {
            count: getStoreDiscountsCount(Number(store?.id), stats),
          })}
        </Text> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <DiscountMiniProductsList />
      <View className="bg-card px-3 py-4 ">
        <Text className="text-xl font-bold text-foreground mb-4">
          Zľavy v obchodoch
        </Text>

        <View className="flex-row space-x-2">
          {shops
            ?.sort(
              ({ id: firstStoreId = 0 }, { id: secondStoreId = 0 }) =>
                getStoreDiscountsCount(secondStoreId, stats) -
                getStoreDiscountsCount(firstStoreId, stats)
            )
            .map((store, index) => renderStoreTab(store))}
        </View>
      </View>

      {!!activeStore && (
        <View className="flex-1 py-2 bg-background">
          <DiscountList shop={activeStore} />
        </View>
      )}

      {/* Footer */}
      <View className="bg-card px-4 py-3 border-t border-border">
        <Text className="text-center text-xs text-muted-foreground">
          Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default GroceryDiscountsScreen;
