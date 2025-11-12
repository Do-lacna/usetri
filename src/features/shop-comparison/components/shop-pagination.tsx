import type React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { HybridCartComparisonDto } from '~/src/network/model';

interface ShopPaginationProps {
  carts: HybridCartComparisonDto[] | null;
  currentCartIndex: number;
  onGoToShop: (index: number) => void;
  areMoreCartsAvailable: boolean;
}

export const ShopPagination: React.FC<ShopPaginationProps> = ({
  carts,
  currentCartIndex,
  onGoToShop,
  areMoreCartsAvailable,
}) => {
  if (!areMoreCartsAvailable) return null;

  return (
    <View className="flex-row justify-center space-x-2 mb-4">
      {carts?.map(({ shop }, index) => (
        <TouchableOpacity
          key={shop?.id}
          onPress={() => onGoToShop(index)}
          className={`w-3 h-3 rounded-full mr-1 ${
            index === currentCartIndex ? 'bg-primary' : 'bg-terciary'
          }`}
        />
      ))}
    </View>
  );
};
