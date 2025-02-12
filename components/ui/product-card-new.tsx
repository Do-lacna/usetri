import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ShopItemDto } from "../../network/model";
import { useGetShops } from "../../network/query/query";
import { getShopLogo } from "../../utils/logo-utils";

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
  onPress?: (id: number, categoryId: number) => void;
  className?: string;
}

const ProductCardNew = ({
  product,
  availableShopIds = [],
  onPress,
  className,
}: IProductCardProps) => {
  const {
    detail: {
      // imageUrl = "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
      name,
      brand,
      amount,
      barcode,
      unit,
      category: { id: categoryId } = {},
    } = {},
    price = 0,
  } = { ...product };

  const { data: { shops = [] } = {} } = useGetShops();

  return (
    // <Link asChild href={`/product/${barcode}`}>
    <Pressable
      className={clsx("w-40 mr-20 last:mr-0 flex-1", className)}
      onPress={() => onPress?.(Number(barcode), Number(categoryId))}
      // onPress={() => console.log("prudct")}
    >
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
            <View className="flex-1">
              <Text className="text-xs text-gray-600" numberOfLines={1}>
                {brand}
              </Text>
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
        <View className="flex-row gap-x-2 mt-1 relative">
          {availableShopIds?.map((retailer, index) => (
            <View
              key={retailer}
              style={{ width: 20, height: 20, borderRadius: 50 }}
            >
              <Image
                {...getShopLogo(retailer as any)}
                key={index}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 50,
                  position: "absolute",
                  right: index * 15,
                  zIndex: index + 1,
                  backgroundColor: "white",
                  //TODO add here some elevation to visually differentiate the shop logos
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </Pressable>
    // </Link>
  );
};

export default ProductCardNew;
