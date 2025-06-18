import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../../lib/constants";
import { ShopItemDto } from "../../../network/model";
import { useGetShops } from "../../../network/query/query";
import { getShopLogo } from "../../../utils/logo-utils";
import { Badge } from "../badge";

export interface IProduct {
  id: string;
  imageUrl?: string;
  name?: string;
  brand?: string;
  amount?: string;
  price?: string;
  discount_price?: string; // Added discount_price to interface
  retailer_ids?: number[];
  [key: string]: any; // Index signature
}

export interface IProductCardProps {
  product?: ShopItemDto;
  availableShopIds: number[] | null;
  onPress?: (barcode: string, categoryId: number) => void;
  className?: string;
}

const ProductCardNew2 = ({
  product,
  availableShopIds = [],
  onPress,
  className,
}: IProductCardProps) => {
  const {
    detail: {
      image_url,
      name,
      brand,
      amount,
      barcode,
      unit,
      category: { id: categoryId } = {},
    } = {},
    price = 0,
    discount_price,
  } = { ...product };

  // Calculate percentage discount
  const calculateDiscountPercentage = () => {
    if (!discount_price || !price) return null;
    const originalPrice = parseFloat(String(price));
    const discountedPrice = parseFloat(String(discount_price?.price));
    if (originalPrice > 0 && discountedPrice < originalPrice) {
      return Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }
    return null;
  };

  const percentageDiscount = calculateDiscountPercentage();
  const hasDiscount = !!discount_price && percentageDiscount;

  const { data: { shops = [] } = {} } = useGetShops();

  const renderPricing = () => {
    if (hasDiscount) {
      return (
        <View className="flex-row items-center space-x-1">
          {/* Original price - crossed out */}
          <Text className="text-xs text-gray-400 line-through">{price} €</Text>
          {/* Discount price - highlighted */}
          <Text className="text-sm font-bold text-red-600 ml-1">
            {discount_price?.price} €
          </Text>
        </View>
      );
    }

    // Regular price when no discount
    return <Text className="text-sm font-bold">{price} €</Text>;
  };

  return (
    <Pressable
      className={clsx("w-40 mr-20 last:mr-0 flex-1", className)}
      onPress={() => onPress?.(String(barcode), Number(categoryId))}
    >
      <View className="bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10">
        <Image
          source={{ uri: image_url ? image_url : PLACEHOLDER_PRODUCT_IMAGE }}
          className="w-full h-32 rounded-lg"
          resizeMode="contain"
        />

        {/* Amount/Unit Badge */}
        <Badge className="absolute top-2 bg-terciary">
          <Text className="text-xs text-primary-foreground">{`${amount} ${unit}`}</Text>
        </Badge>

        {/* Discount Badge - only show if there's a real discount */}
        {hasDiscount && (
          <Badge className="absolute top-9 bg-red-500">
            <Text className="text-xs text-white font-semibold">
              -{percentageDiscount}%
            </Text>
          </Badge>
        )}

        {/* Shop logos */}
        <View className="absolute bottom-16 flex-row gap-x-2 mt-1">
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
                  borderColor: "grey",
                  borderWidth: 1,
                }}
              />
            </View>
          ))}
        </View>

        {/* Product Info */}
        <View className="mt-2 space-y-1">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs text-gray-600" numberOfLines={1}>
                {brand}
              </Text>
              <Text className="text-sm font-medium" numberOfLines={1}>
                {name}
              </Text>
              {renderPricing()}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCardNew2;
