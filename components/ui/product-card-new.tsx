import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

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
  product: IProduct;
  onPress?: () => void;
}

const ProductCardNew = ({ product, onPress }: IProductCardProps) => {
  const {
    imageUrl,
    name,
    brand,
    amount,
    price,
    retailer_ids = [],
    id,
  } = product;

  return (
    <Link asChild href={`/product/${product.id}`}>
      <Pressable className="w-40 mr-20 last:mr-0">
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
          <View className="flex-row gap-x-2 mt-1">
            {retailer_ids.map((retailer, index) => (
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
