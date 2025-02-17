import React from "react";
import { View } from "react-native";
import { Card, CardTitle } from "../card";
import { Text } from "../text";

interface ProductCardProps {
  totalSaved?: number;
  monthlySaved?: number;
}

const TotalSavedCard: React.FC<ProductCardProps> = ({
  totalSaved,
  monthlySaved,
}) => {
  return (
    <Card className="w-full bg-primary p-4">
      <CardTitle className="mb-4">Ušetril si už</CardTitle>
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl text-center">7.69</Text>
          <Text className="text-center">Tento mesiac</Text>
        </View>
        <View className="h-[100%] w-0.5 bg-divider" />
        <View className="flex-1">
          <Text className="text-2xl text-center">7.69</Text>
          <Text className="text-center">Tento mesiac</Text>
        </View>
      </View>
    </Card>
  );
};

TotalSavedCard.displayName = "TotalSavedCard";

export { TotalSavedCard };
