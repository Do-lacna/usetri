import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { isArrayNotEmpty } from '~/lib/utils';
import { CartComparisonDto, ShopExtendedDto } from '~/network/model';
import { getShopLogo } from '~/utils/logo-utils';

interface ShopNavigationHeaderProps {
  currentShop?: ShopExtendedDto;
  carts: CartComparisonDto[];
  onPrevShop: () => void;
  onNextShop: () => void;
  areMoreCartsAvailable: boolean;
}

export const ShopNavigationHeader: React.FC<ShopNavigationHeaderProps> = ({
  currentShop,
  carts,
  onPrevShop,
  onNextShop,
  areMoreCartsAvailable,
}) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      {areMoreCartsAvailable && (
        <TouchableOpacity
          onPress={onPrevShop}
          className="p-2 rounded-full bg-white shadow-sm border border-gray-200"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ChevronLeft size={20} color="#4B5563" />
        </TouchableOpacity>
      )}

      <View className="flex-1 items-center">
        <Image
          {...getShopLogo(currentShop?.id as any)}
          className="w-16 h-16 rounded-full"
          resizeMode="contain"
        />
      </View>

      {areMoreCartsAvailable && (
        <TouchableOpacity
          onPress={onNextShop}
          className="p-2 rounded-full bg-white shadow-sm border border-gray-200"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ChevronRight size={20} color="#4B5563" />
        </TouchableOpacity>
      )}
    </View>
  );
};