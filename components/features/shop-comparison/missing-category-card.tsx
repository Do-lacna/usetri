import type React from 'react';
import { Image, Text, View } from 'react-native';
import type { CategoryDto } from '../../../network/model';

interface MissingCategoryCardProps {
  category: CategoryDto;
  index: number;
  totalItems: number;
  shopName?: string; // Optional shop name to display which shop is missing the category
}

export const MissingCategoryCard: React.FC<MissingCategoryCardProps> = ({
  category,
  index,
  totalItems,
  shopName,
}) => {
  const { id, image_url, name: categoryName } = category || {};

  const borderClass = index < totalItems - 1 ? 'border-b border-border' : '';

  return (
    <View className={`p-4 bg-amber-50 dark:bg-amber-950/20 ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            {/* Missing indicator icon */}
            <View className="w-3 h-3 bg-amber-500 rounded-full mr-2" />

            {/* Category image if available */}
            {!!image_url && (
              <Image
                source={{ uri: image_url as string }}
                resizeMode="contain"
                className="w-8 h-8 mr-3"
              />
            )}

            <Text className="text-base font-medium text-muted-foreground line-through">
              {categoryName}
            </Text>
          </View>

          <Text className="text-sm text-muted-foreground ml-5">
            Category not available
          </Text>

          {/* Shop name if provided */}
          {shopName && (
            <Text className="text-xs text-amber-600 mt-1 ml-5">
              Not available at {shopName}
            </Text>
          )}
        </View>

        <View className="items-end ml-4">
          <View className="bg-amber-100 dark:bg-amber-950/40 px-2 py-1 rounded">
            <Text className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Missing
            </Text>
          </View>

          <Text className="text-xs text-muted-foreground mt-1">Category</Text>
        </View>
      </View>
    </View>
  );
};
