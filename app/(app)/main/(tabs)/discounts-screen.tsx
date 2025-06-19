import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "../../../../components/discounts/discount-list";
import DiscountMiniProductsList from "../../../../components/discounts/discount-mini-products-list";
import StoreLogo from "../../../../components/store-logo/store-logo";
import { ShopExtendedDto } from "../../../../network/model";
import {
  useGetDiscounts,
  useGetDiscountsStatistics,
  useGetShops,
} from "../../../../network/query/query";

const GroceryDiscountsScreen: React.FC = () => {
  const { data: { shops } = {}, isLoading: areShopsLoading } = useGetShops();

  const [activeStoreId, setActiveStoreId] = useState(shops?.[0]?.id || 0); // Default to first store if available

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  ); // Fallback to first store if none is selected

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const {
    data: { products: mostSaleProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetDiscounts();

  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();

  React.useEffect(() => {
    if ([...(shops ?? [])].length > 0 && !activeStoreId) {
      setActiveStoreId(Number(shops?.[0].id));
    }
  }, [shops, activeStoreId]);

  const renderStoreTab = (store: ShopExtendedDto) => {
    const discountsCount =
      stats?.find((stat) => stat.shop_id === store.id)?.valid_discounts_count ||
      0;
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
        <Text
          className={`text-xs ${
            store?.id === activeStoreId ? "text-black" : "text-gray-500"
          }`}
        >
          {discountsCount} akcií
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <DiscountMiniProductsList />
      <View className="bg-white px-3 py-4 border-b border-gray-200">
        <View className="flex-row space-x-2">
          {shops?.map((store, index) => renderStoreTab(store))}
        </View>
      </View>

      {/* <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-800">
              {activeStore?.name}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${activeStore.color}`}>
            <Text className="text-white font-medium text-sm">
              {activeStore.discounts.length} akcií
            </Text>
          </View>
        </View> */}

      {/* <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">
            Platnosť: {formatDate(new Date ())} -{" "}
            {formatDate(activeStore.validTo)}
          </Text>
          <View className="ml-2 bg-green-100 px-2 py-1 rounded">
            <Text className="text-green-700 text-xs font-medium">Aktívne</Text>
          </View>
        </View> */}
      {/* </View> */}

      {/* Discounts List */}
      {/* <FlatList
        data={activeStore.discounts}
        renderItem={({ item }) => (}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-lg">Žiadne akcie</Text>
            <Text className="text-gray-400 text-sm mt-1">
              Momentálne nie sú dostupné žiadne zľavy
            </Text>
          </View>
        }
      /> */}
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
