import { format } from "date-fns";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { DATE_FORMAT } from "../../../lib/constants";
import { getShopById } from "../../../lib/utils";
import { useGetShops } from "../../../network/query/query";
import { getShopLogo } from "../../../utils/logo-utils";
import { Card } from "../card";
import { Text } from "../text";

export interface SavedCartCardProps {
  id: number;
  shopId: number;
  totalPrice: number;
  createdDate: string;
}

const SavedCartCard: React.FC<SavedCartCardProps> = ({
  id,
  shopId,
  totalPrice,
  createdDate,
}) => {
  const { data: { shops = [] } = {} } = useGetShops();
  const shopName = getShopById(shopId, shops ?? [])?.name;

  return (
    <Card className="w-full max-h-20">
      <TouchableOpacity
        onPress={() => router.navigate(`/main/archived-cart/${id}`)}
        className="h-full bg-white p-4 rounded-xl shadow-sm relative overflow-hidden"
      >
        <Image
          className="absolute h-16 w-16 -rotate-45 top-2 opacity-30 -left-2"
          {...getShopLogo(shopId as any)}
        />
        <View className="ml-12 flex-row items-center justify-between space-x-2">
          <View className="flex-1">
            <Text
              className="font-semibold text-lg mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Nákup v {shopName}
            </Text>
            <Text className="text-gray-600 text-sm">
              {format(createdDate, DATE_FORMAT)}
            </Text>
          </View>
          <Text className="text-lg font-bold">{totalPrice.toFixed(2)} €</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

SavedCartCard.displayName = "SavedCartCard";

export { SavedCartCard };
