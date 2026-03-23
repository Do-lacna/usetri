import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import type { CategoryDto } from '~/src/network/model';

interface MissingCategoryCardProps {
  category: CategoryDto;
  index: number;
  totalItems: number;
  shopName?: string;
}

export const MissingCategoryCard: React.FC<MissingCategoryCardProps> = ({
  category,
  index,
  totalItems,
  shopName,
}) => {
  const { t } = useTranslation();
  const { image_url, name: categoryName } = category || {};

  const borderClass = index < totalItems - 1 ? 'border-b border-border' : '';

  return (
    <View className={`p-4 bg-g2 ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className="w-3 h-3 bg-warning rounded-full mr-2" />

            {!!image_url && (
              <Image
                source={{ uri: image_url }}
                resizeMode="contain"
                className="w-8 h-8 mr-3"
              />
            )}

            <Text className="text-base font-expose text-muted-foreground line-through">
              {categoryName}
            </Text>
          </View>

          <Text className="text-sm font-expose text-muted-foreground ml-5">
            {t('shop_comparison.category_not_available')}
          </Text>

          {shopName && (
            <Text className="text-xs font-expose text-g3 mt-1 ml-5">
              {t('shop_comparison.not_available_at', { shopName })}
            </Text>
          )}
        </View>

        <View className="items-end ml-4">
          <View className="bg-g1 px-2 py-1 rounded">
            <Text className="text-sm font-expose-bold text-foreground">
              {t('shop_comparison.missing')}
            </Text>
          </View>

          <Text className="text-xs font-expose text-muted-foreground mt-1">
            {t('shop_comparison.category')}
          </Text>
        </View>
      </View>
    </View>
  );
};
