import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle } from '~/src/lib/icons/AlertCircle';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';

interface ShopPriceItemProps {
  shopId: number;
  shopName: string;
  price: number;
  discountPrice?: number | null;
  isSelected: boolean;
  onSelect: (shopId: number) => void;
  isAvailable?: boolean; // Flag to indicate product availability
}

export const ShopPriceItem: React.FC<ShopPriceItemProps> = ({
  shopId,
  shopName,
  price,
  discountPrice,
  isSelected,
  onSelect,
  isAvailable = true, // Default to available
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => onSelect(shopId)}
      className={`p-4 rounded-lg border-2 mb-3 ${
        isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
      } ${!isAvailable ? 'opacity-90' : ''}`}
    >
      {/* Shop name and price row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1 gap-4">
          <ShopLogoBadge shopId={shopId} size={32} />
          <Text className="text-lg font-semibold text-foreground mr-2">
            {shopName}
          </Text>
        </View>

        <View className="items-end">
          {discountPrice ? (
            <View className="flex-row items-center space-x-1">
              <Text className="text-xl font-bold text-destructive mr-1">
                {discountPrice.toFixed(2)} €
              </Text>
              <Text className="text-xl text-muted-foreground line-through">
                {price.toFixed(2)} €
              </Text>
            </View>
          ) : (
            <Text className="text-xl font-bold text-foreground">
              {price.toFixed(2)} €
            </Text>
          )}

          {isSelected && (
            <View className="w-2 h-2 bg-primary rounded-full mt-1" />
          )}
        </View>
      </View>

      {/* Availability warning - below the row */}
      {!isAvailable && (
        <View className="flex-row items-center px-2 py-1.5 bg-yellow-100 dark:bg-yellow-200 rounded-md self-start">
          <AlertCircle
            size={12}
            className="mr-1.5 text-foreground dark:text-background"
          />
          <Text className="text-xs font-medium text-foreground dark:text-background">
            {t('product.may_not_be_available')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
