import type React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { ArrowRight } from '~/src/lib/icons/ArrowRight';
import { isArrayNotEmpty } from '~/src/lib/utils';
import type {
  HybridCartComparisonDto,
  ShopExtendedDto,
} from '~/src/network/model';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';

interface ShopNavigationHeaderProps {
  currentShop?: ShopExtendedDto;
  carts: HybridCartComparisonDto[] | null;
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
          className="p-2 rounded-full bg-card shadow-sm border border-border"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ArrowLeft size={20} className="text-foreground" />
        </TouchableOpacity>
      )}

      <View className="flex-1 items-center">
        {currentShop?.id && <ShopLogoBadge shopId={currentShop.id} size={64} />}
      </View>

      {areMoreCartsAvailable && (
        <TouchableOpacity
          onPress={onNextShop}
          className="p-2 rounded-full bg-card shadow-sm border border-border"
          disabled={!isArrayNotEmpty(carts)}
        >
          <ArrowRight size={20} className="text-foreground" />
        </TouchableOpacity>
      )}
    </View>
  );
};
