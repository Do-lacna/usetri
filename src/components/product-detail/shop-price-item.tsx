import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatDiscountValidity } from '~/src/features/discounts/utils/format-validity';
import { AlertCircle } from '~/src/lib/icons/AlertCircle';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';

interface ShopPriceItemProps {
  shopId: number;
  shopName: string;
  price: number;
  productValidTo?: string | null;
  discountPrice?: number | null;
  discountValidFrom?: string;
  discountValidTo?: string;
  isSelected: boolean;
  onSelect: (shopId: number) => void;
  isAvailable?: boolean; // Flag to indicate product availability
}

export const ShopPriceItem: React.FC<ShopPriceItemProps> = ({
  shopId,
  shopName,
  price,
  productValidTo,
  discountPrice,
  discountValidFrom,
  discountValidTo,
  isSelected,
  onSelect,
  isAvailable = true, // Default to available
}) => {
  const { t } = useTranslation();

  const validityText = discountPrice
    ? formatDiscountValidity(discountValidFrom, discountValidTo)
    : null;
  const latestAvailabilityDate = productValidTo
    ? new Date(productValidTo).toLocaleDateString()
    : null;

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
          <Text className="text-lg font-expose-bold text-foreground mr-2">
            {shopName}
          </Text>
        </View>

        <View className="items-end">
          {discountPrice ? (
            <>
              <View className="flex-row items-center space-x-1">
                <Text className="text-xl font-expose-bold text-destructive mr-1">
                  {discountPrice.toFixed(2)} €
                </Text>
                <Text className="text-xl font-expose text-muted-foreground line-through">
                  {price.toFixed(2)} €
                </Text>
              </View>
              {validityText && (
                <View className="px-2 py-0.5 bg-border rounded-full mt-1">
                  <Text className="text-[11px] font-expose font-medium text-foreground/70">
                    {validityText}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text className="text-xl font-expose-bold text-foreground">
              {price.toFixed(2)} €
            </Text>
          )}
        </View>
      </View>

      {/* Availability warning - below the row */}
      {!isAvailable && (
        <View className="flex-row items-start px-2 py-1.5 bg-secondary rounded-md">
          <AlertCircle
            size={12}
            className="mr-1.5 mt-0.5 text-foreground dark:text-background"
          />
          <View className="flex-1">
            <Text className="text-xs font-expose font-medium text-foreground dark:text-background">
              {t('product.may_not_be_available')}
              {latestAvailabilityDate
                ? ` (${t('product.last_available_on', { date: latestAvailabilityDate })})`
                : ''}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
