import React from "react";
import { Image, Text, View } from "react-native";
import { CategoryDto } from "../../network/model";

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

  const borderClass = index < totalItems - 1 ? "border-b border-gray-100" : "";

  return (
    <View className={`p-4 bg-orange-50 ${borderClass}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            {/* Missing indicator icon */}
            <View className="w-3 h-3 bg-orange-500 rounded-full mr-2" />

            {/* Category image if available */}
            {!!image_url && (
              <Image
                source={{ uri: image_url as string }}
                resizeMode="contain"
                className="w-8 h-8 mr-3"
              />
            )}

            <Text className="text-base font-medium text-gray-700 line-through">
              {categoryName}
            </Text>
          </View>

          <Text className="text-sm text-gray-500 ml-5">
            Category not available
          </Text>

          {/* Shop name if provided */}
          {shopName && (
            <Text className="text-xs text-orange-600 mt-1 ml-5">
              Not available at {shopName}
            </Text>
          )}
        </View>

        <View className="items-end ml-4">
          <View className="bg-orange-100 px-2 py-1 rounded">
            <Text className="text-sm font-medium text-orange-700">Missing</Text>
          </View>

          <Text className="text-xs text-gray-400 mt-1">Category</Text>
        </View>
      </View>
    </View>
  );
};
