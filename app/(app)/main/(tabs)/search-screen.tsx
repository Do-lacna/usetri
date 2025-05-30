import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import StoreLogo from "../../../../components/store-logo/store-logo";
import DiscountList from "../../../../components/ui/discount-list";
import { ShopExtendedDto } from "../../../../network/model";
import { useGetShops } from "../../../../network/query/query";

// Types
interface DiscountItem {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  imageUrl?: string;
  category: string;
}

interface GroceryStore {
  id: string;
  name: string;
  logo: string;
  color: string;
  validFrom: string;
  validTo: string;
  discounts: DiscountItem[];
}

// Mock data for Slovak grocery stores
const groceryStores: GroceryStore[] = [
  {
    id: "tesco",
    name: "Tesco",
    logo: "🛒",
    color: "bg-blue-500",
    validFrom: "2025-05-29",
    validTo: "2025-06-05",
    discounts: [
      {
        id: "1",
        name: "Chlieb pšeničný",
        originalPrice: 1.29,
        discountedPrice: 0.99,
        discountPercentage: 23,
        category: "Pečivo",
      },
      {
        id: "2",
        name: "Mlieko 3,5% 1L",
        originalPrice: 1.45,
        discountedPrice: 1.19,
        discountPercentage: 18,
        category: "Mliečne výrobky",
      },
      {
        id: "3",
        name: "Banány 1kg",
        originalPrice: 2.19,
        discountedPrice: 1.69,
        discountPercentage: 23,
        category: "Ovocie",
      },
      // Add more items as needed
    ],
  },
  {
    id: "kaufland",
    name: "Kaufland",
    logo: "🏪",
    color: "bg-red-500",
    validFrom: "2025-05-28",
    validTo: "2025-06-04",
    discounts: [
      {
        id: "4",
        name: "Jogurt prirodný 500g",
        originalPrice: 1.89,
        discountedPrice: 1.39,
        discountPercentage: 26,
        category: "Mliečne výrobky",
      },
      {
        id: "5",
        name: "Šunka bratrská 100g",
        originalPrice: 3.49,
        discountedPrice: 2.79,
        discountPercentage: 20,
        category: "Mäso",
      },
      {
        id: "6",
        name: "Paradajky 1kg",
        originalPrice: 3.99,
        discountedPrice: 2.99,
        discountPercentage: 25,
        category: "Zelenina",
      },
    ],
  },
  {
    id: "lidl",
    name: "Lidl",
    logo: "🛍️",
    color: "bg-yellow-500",
    validFrom: "2025-05-27",
    validTo: "2025-06-03",
    discounts: [
      {
        id: "7",
        name: "Vajcia L 10ks",
        originalPrice: 2.99,
        discountedPrice: 2.29,
        discountPercentage: 23,
        category: "Vajcia",
      },
      {
        id: "8",
        name: "Syr eidam 45% 200g",
        originalPrice: 2.79,
        discountedPrice: 2.19,
        discountPercentage: 22,
        category: "Mliečne výrobky",
      },
      {
        id: "9",
        name: "Káva zrnková 500g",
        originalPrice: 8.99,
        discountedPrice: 6.99,
        discountPercentage: 22,
        category: "Nápoje",
      },
    ],
  },
  {
    id: "coop",
    name: "COOP Jednota",
    logo: "🏬",
    color: "bg-green-500",
    validFrom: "2025-05-29",
    validTo: "2025-06-06",
    discounts: [
      {
        id: "10",
        name: "Ryža dlhozrnná 1kg",
        originalPrice: 2.49,
        discountedPrice: 1.99,
        discountPercentage: 20,
        category: "Obilniny",
      },
      {
        id: "11",
        name: "Olej slnečnicový 1L",
        originalPrice: 3.29,
        discountedPrice: 2.49,
        discountPercentage: 24,
        category: "Oleje",
      },
      {
        id: "12",
        name: "Detský krém 200ml",
        originalPrice: 4.99,
        discountedPrice: 3.99,
        discountPercentage: 20,
        category: "Kozmetika",
      },
    ],
  },
];

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

  const renderStoreTab = (store: ShopExtendedDto) => (
    <TouchableOpacity
      key={store.id}
      onPress={() => setActiveStoreId(Number(store?.id))}
      className={`flex-1 items-center py-3 mx-1 rounded-xl bg-divider border-2 border-${
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
        12 akcií
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Akciové ponuky
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-1">
          Najlepšie zľavy v obchodoch
        </Text>
      </View>

      {/* Store Tabs */}
      <View className="bg-white px-3 py-4 border-b border-gray-200">
        <View className="flex-row space-x-2">
          {shops?.map((store, index) => renderStoreTab(store))}
        </View>
      </View>

      {/* <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="text-3xl mr-3">{activeStore.logo}</Text>
            <Text className="text-xl font-bold text-gray-800">
              {activeStore.name}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${activeStore.color}`}>
            <Text className="text-white font-medium text-sm">
              {activeStore.discounts.length} akcií
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">
            Platnosť: {formatDate(activeStore.validFrom)} -{" "}
            {formatDate(activeStore.validTo)}
          </Text>
          <View className="ml-2 bg-green-100 px-2 py-1 rounded">
            <Text className="text-green-700 text-xs font-medium">Aktívne</Text>
          </View>
        </View>
      </View> */}

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
        <View className="flex-1 px-4 py-2 bg-white">
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
