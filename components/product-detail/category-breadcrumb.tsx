import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, View } from 'react-native';

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
            className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {category}
          </Text>
          {index < categories.length - 1 && (
            <Ionicons
              name="chevron-forward"
              size={12}
              color="hsl(240, 3.8%, 46.1%)"
              className="mx-1"
            />
          )}
        </View>
      ))}
    </View>
  );
};
