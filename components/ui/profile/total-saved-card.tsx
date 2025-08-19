import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Platform, View } from "react-native";
import { useGetArchivedCart } from "../../../network/customer/customer";
import { Card } from "../card";
import { Skeleton } from "../skeleton";
import { Text } from "../text";

type ProductCardProps = {}

const TotalSavedCard: React.FC<ProductCardProps> = () => {
  const {
    isLoading,
    data: { total_price_spared = 0, total_price_spared_last_month = 0 } = {},
  } = useGetArchivedCart();

  if (isLoading) {
    return <Skeleton className="w-full  h-28 bg-divider p-4" />;
  }

  return (
    // <Card className="w-full h-28 bg-divider p-4">
    //   <CardTitle className="mb-4">Ušetril si už</CardTitle>
    //   <View className="flex-1 flex-row items-center justify-between">
    //     <View className="flex-1">
    //       <Text className="text-2xl font-bold text-center text-primary">
    //         {total_price_spared_last_month.toFixed(2)} €
    //       </Text>
    //       <Text className="text-center">Tento mesiac</Text>
    //     </View>
    //     <View className="h-[100%] w-0.5 bg-dividerDark" />
    //     <View className="flex-1">
    //       <Text className="text-2xl font-bold text-center text-primary">
    //         {total_price_spared.toFixed(2)} €
    //       </Text>
    //       <Text className="text-center">Celkovo</Text>
    //     </View>
    //   </View>
    // </Card>

    <Card className="w-full px-4 py-2">
      <Text className="text-lg font-semibold text-gray-900">Vaše úspory</Text>
      <View className="flex-row space-x-4">
        <View className={`flex-1 rounded-2xl p-4 ${Platform.OS === 'ios' ? 'shadow-lg' : ''}`}>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={20} />
            <Text className="text-sm font-medium ml-2">Tento mesiac</Text>
          </View>
          <Text className="text-2xl font-bold">
            {total_price_spared_last_month.toFixed(2)} €
          </Text>
        </View>

        {/* Total Savings */}
     <View className={`flex-1 rounded-2xl p-4 ${Platform.OS === 'ios' ? 'shadow-lg' : ''}`}>
          <View className="flex-row items-center mb-2">
            <Ionicons name="trending-up-outline" size={20} />
            <Text className="text-sm font-medium ml-2">Celkovo</Text>
          </View>
          <Text className="text-2xl font-bold">
            {total_price_spared.toFixed(2)} €
          </Text>
        </View>
      </View>
    </Card>
  );
};

TotalSavedCard.displayName = "TotalSavedCard";

export { TotalSavedCard };
