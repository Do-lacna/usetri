import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../lib/constants";
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
  onPress?: (barcode: string, categoryId: number) => void;
  className?: string;
  isSelected?: boolean;
}

const SuggestedProductCard = ({
  product,
  availableShopIds = [],
  onPress,
  className,
  isSelected,
}: IProductCardProps) => {
  const {
    detail: {
      name,
      brand,
      amount,
      barcode,
      unit,
      category: { id: categoryId } = {},
      image_url,
    } = {},
    price = 0,
  } = { ...product };

  const { data: { shops = [] } = {} } = useGetShops();

  return (
    <Pressable
      className={clsx("w-32 mr-20 last:mr-0 flex-1", className)}
      onPress={() => onPress?.(String(barcode), Number(categoryId))}
    >
      <View
        className={clsx(
          "bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10",
          isSelected ? "border-2 border-primary" : ""
        )}
      >
        <View className="w-full h-24 rounded-lg relative">
          <Image
            source={{
              uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-24 rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
            {availableShopIds?.map((retailer, index) => (
              <View
                key={retailer}
                style={{ width: 18, height: 18, borderRadius: 50 }}
              >
                <Image
                  {...getShopLogo(retailer as any)}
                  key={index}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 50,
                    position: "absolute",
                    right: index * 15,
                    zIndex: index + 1,
                    backgroundColor: "white",
                    borderColor: "grey",
                    borderWidth: 1,
                    //TODO add here some elevation to visually differentiate the shop logos
                  }}
                />
              </View>
            ))}
          </View>
        </View>

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
            <Text className="text-sm font-bold">{price} €</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SuggestedProductCard;
