import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export interface IProduct {
  id?: string;
  imageUrl?: string;
  name?: string;
  brand?: string;
  amount?: string;
  price?: string;
}

export interface IProductCardProps {
  product: IProduct;
  onPress: () => void;
}

const ProductCardNew = ({ product, onPress }: IProductCardProps) => {
  const { imageUrl, name, brand, amount, price } = product;

  return (
    <Pressable onPress={onPress} className="w-40 mr-20 last:mr-0">
      <View className="bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10">
        <Image
          source={{ uri: imageUrl }}
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
              <Text className="text-xs text-gray-500">{amount}</Text>
            </View>
            <Text className="text-sm font-bold">{price}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCardNew;
