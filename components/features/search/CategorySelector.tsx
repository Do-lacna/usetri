import React from "react";
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  View,
} from "react-native";
import type { PopularCategoryDto } from "../../../network/model";
import { Card } from "../../ui/card";
import { Text } from "../../ui/text";

interface CategorySelectorProps {
  categories: PopularCategoryDto[];
  selectedCategoryId?: number;
  onCategorySelect: (category: PopularCategoryDto) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  // Sort categories to put the selected one first
  const sortedCategories = React.useMemo(() => {
    if (!selectedCategoryId) return categories;

    const selectedCategory = categories.find(
      (cat) => cat.category?.id === selectedCategoryId
    );
    const otherCategories = categories.filter(
      (cat) => cat.category?.id !== selectedCategoryId
    );

    return selectedCategory
      ? [selectedCategory, ...otherCategories]
      : categories;
  }, [categories, selectedCategoryId]);

  const renderCategory = ({ item }: ListRenderItemInfo<PopularCategoryDto>) => {
    const { name, id, image_url } = item.category || {};
    const isSelected = selectedCategoryId === id;

    return (
      <Pressable onPress={() => onCategorySelect(item)}>
        <Card
          className={`flex flex-row items-center p-2 bg-divider ${
            isSelected ? "border-2 border-terciary" : "bg-divider"
          }`}
        >
          {!!image_url && (
            <Image
              source={{ uri: image_url as string }}
              resizeMode="contain"
              className="w-8 h-8 mr-4"
            />
          )}

          <Text>{name}</Text>
        </Card>
      </Pressable>
    );
  };

  return (
    <View className="my-4">
      <FlatList
        horizontal
        data={sortedCategories}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={renderCategory}
        keyExtractor={(category) => String(category?.category?.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};
