import React from "react";
import { View } from "react-native";
import { useGetArchivedCart } from "../../../network/customer/customer";
import { Card, CardTitle } from "../card";
import { Skeleton } from "../skeleton";
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
    isLoading,
    data: { total_price_spared = 0, total_price_spared_last_month = 0 } = {},
  } = useGetArchivedCart();

  if (isLoading) {
    return <Skeleton className="w-full  h-28 bg-divider p-4" />;
  }

  return (
    <Card className="w-full h-28 bg-divider p-4">
      <CardTitle className="mb-4">Ušetril si už</CardTitle>
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center text-primary">
            {total_price_spared_last_month} €
          </Text>
          <Text className="text-center">Tento mesiac</Text>
        </View>
        <View className="h-[100%] w-0.5 bg-dividerDark" />
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center text-primary">
            {total_price_spared} €
          </Text>
          <Text className="text-center">Celkovo</Text>
        </View>
      </View>
    </Card>
  );
};

TotalSavedCard.displayName = "TotalSavedCard";

export { TotalSavedCard };
