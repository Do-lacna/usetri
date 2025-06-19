import React from "react";
import { Image, Text, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../lib/constants";
import { calculateDiscountPercentage } from "../../lib/number-utils";
import { ShopItemDto } from "../../network/model";
import { getShopLogo } from "../../utils/logo-utils";

// Types
interface Shop {
  id: string;
  name: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  availableShops: Shop[];
}

interface ProductCardProps {
  product: ShopItemDto;
}

const DiscountedMiniProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    price,
    discount_price: { price: discountedPrice } = {},
    detail: { image_url, name } = {},
    shop_id,
  } = product;
  return (
    <View className="bg-white rounded-lg p-2 mx-2 shadow-sm border border-gray-100 w-32">
      {/* Discount Badge */}
      <View className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1 z-10">
        <Text className="text-white text-xs font-bold">
          -{calculateDiscountPercentage(Number(price), discountedPrice)}%
        </Text>
      </View>

      {/* Product Image */}
      <View className="w-full h-16 rounded-lg relative">
        <Image
          source={{ uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE }}
          className="w-full h-16 rounded-md mb-2"
          resizeMode="cover"
        />

        <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
          {/* {TODO add all available shops from BE} */}
          {[shop_id]?.map((retailer, index) => (
            <View
              key={retailer}
              style={{ width: 15, height: 15, borderRadius: 50 }}
            >
              <Image
                {...getShopLogo(retailer as any)}
                key={index}
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 50,
                  position: "absolute",
                  right: index * 12,
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

      {/* Product Name */}
      <Text
        className="text-gray-800 text-xs font-medium mb-1 leading-4"
        numberOfLines={1}
      >
        {name}
      </Text>

      {/* Price Information */}
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-400 text-xs line-through">
          {price?.toFixed(2)} €
        </Text>
        <Text className="text-red-600 text-xs font-bold">
          {discountedPrice?.toFixed(2)} €
        </Text>
      </View>
    </View>
  );
};

export default DiscountedMiniProductCard;
