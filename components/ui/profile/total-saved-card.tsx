import React from "react";
import { View } from "react-native";
import { useGetArchivedCart } from "../../../network/customer/customer";
import { Card, CardTitle } from "../card";
import { Text } from "../text";

interface ProductCardProps {
  totalSaved?: number;
  monthlySaved?: number;
}

const TotalSavedCard: React.FC<ProductCardProps> = ({
  totalSaved = 0,
  monthlySaved = 0,
}) => {
  const {
    data: { total_price_spared = 0, total_price_spared_last_month = 0 } = {},
  } = useGetArchivedCart();

  return (
    <Card className="w-full bg-primary p-4">
      <CardTitle className="mb-4">Ušetril si už</CardTitle>
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center">
            {total_price_spared_last_month}
          </Text>
          <Text className="text-center">Tento mesiac</Text>
        </View>
        <View className="h-[100%] w-0.5 bg-divider" />
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center">
            {total_price_spared}
          </Text>
          <Text className="text-center">Celkovo</Text>
        </View>
      </View>
    </Card>
  );
};

TotalSavedCard.displayName = "TotalSavedCard";

export { TotalSavedCard };
