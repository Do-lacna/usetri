import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Shop {
  id: string;
  name: string;
  logo?: string;
}

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  brand: string;
  amount: number;
  unit: string;
  price: number;
  discountedPrice?: number;
  availableShops: Shop[];
  onPress?: (productId: string) => void;
}

const ProductCardAltik: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  brand,
  amount,
  unit,
  price,
  discountedPrice,
  availableShops,
  onPress,
}) => {
  const handlePress = () => {
    onPress?.(id);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-2 mx-1"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Product Image - Takes up about 1/3 of the width */}
        <View className="w-20 h-20 mr-3">
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-md"
            resizeMode="cover"
          />
        </View>

        {/* Product Details - Takes up remaining 2/3 */}
        <View className="flex-1">
          {/* Brand */}
          <Text
            className="text-xs text-gray-500 font-medium mb-1"
            numberOfLines={1}
          >
            {brand}
          </Text>

          {/* Product Name */}
          <Text
            className="text-sm font-semibold text-gray-900 mb-1"
            numberOfLines={2}
          >
            {name}
          </Text>

          {/* Amount and Unit */}
          <Text className="text-xs text-gray-600 mb-2">
            {amount} {unit}
          </Text>

          {/* Price Section */}
          <View className="flex-row items-center mb-2">
            {discountedPrice ? (
              <>
                <Text className="text-sm font-bold text-green-600 mr-2">
                  {formatPrice(discountedPrice)}
                </Text>
                <Text className="text-xs text-gray-500 line-through">
                  {formatPrice(price)}
                </Text>
              </>
            ) : (
              <Text className="text-sm font-bold text-gray-900">
                {formatPrice(price)}
              </Text>
            )}
          </View>

          {/* Available Shops */}
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 mr-2">Available at:</Text>
            <View className="flex-row flex-wrap flex-1">
              {availableShops.slice(0, 3).map((shop, index) => (
                <View key={shop.id} className="flex-row items-center">
                  {shop.logo ? (
                    <Image
                      source={{ uri: shop.logo }}
                      className="w-4 h-4 rounded-sm"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="bg-gray-200 rounded-sm px-1 py-0.5">
                      <Text className="text-xs text-gray-700 font-medium">
                        {shop.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  {index < Math.min(availableShops.length - 1, 2) && (
                    <Text className="text-xs text-gray-400 mx-1">•</Text>
                  )}
                </View>
              ))}
              {availableShops.length > 3 && (
                <Text className="text-xs text-gray-500 ml-1">
                  +{availableShops.length - 3}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardAltik;
