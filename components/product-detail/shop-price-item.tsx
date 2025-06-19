import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getShopLogo } from '~/utils/logo-utils';

interface ShopPriceItemProps {
  shopId: number;
  shopName: string;
  price: number;
  discountPrice?: number | null;
  isSelected: boolean;
  onSelect: (shopId: number) => void;
}

export const ShopPriceItem: React.FC<ShopPriceItemProps> = ({
  shopId,
  shopName,
  price,
  discountPrice,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(shopId)}
      className={`p-4 rounded-lg border-2 mb-3 ${
        isSelected
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1 gap-4">
            <Image
              {...getShopLogo(shopId as any)}
              className="w-8 h-8 rounded-full"
              resizeMode="contain"
            />
            <Text className="text-lg font-semibold text-gray-900 mr-2">
              {shopName}
            </Text>
          </View>
        </View>

        <View className="items-end">
          {discountPrice ? (
            <View className="flex-row items-center space-x-1">
              <Text className="text-xl font-bold text-red-600 mr-1">
                {discountPrice.toFixed(2)} €
              </Text>
              <Text className="text-xl text-gray-400 line-through">
                {price.toFixed(2)} €
              </Text>
            </View>
          ) : (
            <Text className="text-xl font-bold text-gray-900">
              {price.toFixed(2)} €
            </Text>
          )}

          {isSelected && (
            <View className="w-2 h-2 bg-green-500 rounded-full mt-1" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};