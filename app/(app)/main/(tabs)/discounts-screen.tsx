import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "../../../../components/discounts/discount-list";
import DiscountMiniProductsList from "../../../../components/discounts/discount-mini-products-list";
import StoreLogo from "../../../../components/store-logo/store-logo";
import { isArrayNotEmpty } from "../../../../lib/utils";
import { DiscountStatsDto, ShopExtendedDto } from "../../../../network/model";
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
    return (
      <TouchableOpacity
        key={store.id}
        onPress={() => setActiveStoreId(Number(store?.id))}
        className={`flex-1 items-center py-1 mx-1 rounded-xl bg-divider border-2 border-${
          store?.id === activeStoreId ? "terciary" : "divider"
        }`}
      >
        <StoreLogo storeId={store?.id} />
        <Text
          className={`text-xs font-medium 
          ${store?.id === activeStoreId ? "text-black" : "text-gray-600"}`}
        >
          {store.name}
        </Text>
        {/* <Text
          className={`text-xs ${
            store?.id === activeStoreId ? "text-black" : "text-gray-500"
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
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <DiscountMiniProductsList />
      <View className="bg-white px-3 py-4 ">
        <Text className="text-xl font-bold text-gray-800 mb-4">
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
        <View className="flex-1 py-2 bg-white">
          <DiscountList shop={activeStore} />
        </View>
      )}

      {/* Footer */}
      <View className="bg-white px-4 py-3 border-t border-gray-200">
        <Text className="text-center text-xs text-gray-500">
          Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default GroceryDiscountsScreen;
