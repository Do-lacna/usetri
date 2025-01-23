import React from "react";
import { Image, Text, View } from "react-native";
import { Card } from "./card";

export type ProductSuggestionCardProps = {
  id: number;
  imageUrl: string;
  brand: string;
  name: string;
  amount: string;
  retailers: { iconUrl: string }[];
  price: number;
};

const ProductSuggestionCard = ({
  id,
  imageUrl,
  brand,
  name,
  amount,
  retailers,
  price,
}: ProductSuggestionCardProps) => {
  return (
    <Card className="w-full p-4 mb-4 bg-white rounded-lg shadow-md">
      {/* Product Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-48 rounded-t-lg mb-4"
        resizeMode="cover"
      />

      {/* Product Info Container */}
      <View className="flex-row justify-between items-center mb-2">
        <View>
          {/* Brand and Name */}
          <Text className="text-sm text-gray-500">{brand}</Text>
          <Text className="text-lg font-bold">{name}</Text>
        </View>

        {/* Amount */}
        <Text className="text-md text-gray-600">{amount}</Text>
      </View>

      {/* Retailers and Price */}
      <View className="flex-row justify-between items-center">
        {/* Retailer Icons */}
        <View className="flex-row space-x-2">
          {retailers.map((retailer, index) => (
            <Image
              key={index}
              source={{ uri: retailer.iconUrl }}
              className="w-8 h-8 rounded-full"
            />
          ))}
        </View>

        {/* Price */}
        <Text className="text-xl font-bold text-green-600">
          ${price.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
};

export default ProductSuggestionCard;
