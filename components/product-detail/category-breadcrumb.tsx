import type React from 'react';
import { Text, View } from 'react-native';
import { ChevronRight } from '~/lib/icons/ChevronRight';

interface CategoryBreadcrumbProps {
  categories: string[];
}

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  categories,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <View className="px-4 w-full flex-row flex-wrap">
      {categories.map((category, index) => (
        <View key={category} className="flex-row items-center mb-2">
          <Text
            className="text-xs text-foreground bg-muted px-3 py-1 rounded-full"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {category}
          </Text>
          {index < categories.length - 1 && (
            <ChevronRight className="mx-1 text-foreground" size={12} />
          )}
        </View>
      ))}
    </View>
  );
};
