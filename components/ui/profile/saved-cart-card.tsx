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
          {...getShopLogo(shopId as any)}
          style={{
            height: "100%",
            borderRadius: 50,
            position: "absolute",
            top: "30%",
            left: "-20%",
            opacity: 0.2,
            transform: [{ rotate: "-25deg" }],
          }}
        />
        <View className="ml-20 flex-row items-center justify-between space-x-3">
          <View>
            <Text className="font-semibold text-2xl mb-1">
              Nákup v {shopName}
            </Text>
            <Text className="text-gray-600 text-md">
              {format(createdDate, DATE_FORMAT)}
            </Text>
          </View>
          <Text className="text-xl font-bold">{totalPrice.toFixed(2)} €</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

SavedCartCard.displayName = "SavedCartCard";

export { SavedCartCard };
