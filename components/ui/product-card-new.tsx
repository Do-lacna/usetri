import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { ShopItemDto } from "../../network/model";
import { useGetShops } from "../../network/query/query";

export interface IProduct {
  id: string;
  imageUrl?: string;
  name?: string;
  brand?: string;
  amount?: string;
  price?: string;
  retailer_ids?: number[];
  [key: string]: any; // Index signature
}

export interface IProductCardProps {
  product?: ShopItemDto;
  availableShopIds: number[] | null;
  onPress?: () => void;
}

const ProductCardNew = ({
  product,
  availableShopIds = [],
  onPress,
}: IProductCardProps) => {
  const {
    detail: {
      // imageUrl = "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
      name,
      brand,
      amount,
      barcode,
      unit,
    } = {},
    price = 0,
  } = { ...product };

  const { data: { shops = [] } = {} } = useGetShops();

  return (
    <Link asChild href={`/product/${barcode}`}>
      <Pressable className="w-40 mr-20 last:mr-0">
        <View className="bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10">
          <Image
            source={{
              uri: "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
            }}
            className="w-full h-36 rounded-lg"
            resizeMode="cover"
          />

          <View className="mt-2 space-y-1">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xs text-gray-600">{brand}</Text>
                <Text className="text-sm font-medium" numberOfLines={1}>
                  {name}
                </Text>
                <Text className="text-xs text-gray-500">
                  {amount} {unit}
                </Text>
              </View>
              <Text className="text-sm font-bold">{price}</Text>
            </View>
          </View>
          <View className="flex-row gap-x-2 mt-1">
            {availableShopIds?.map((retailer, index) => (
              <SvgUri
                key={index}
                width="20"
                height="20"
                uri="https://upload.wikimedia.org/wikipedia/commons/9/91/Lidl-Logo.svg"
                style={{ borderRadius: 50 }}
              />
            ))}
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductCardNew;
