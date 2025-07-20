import React from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  View,
} from "react-native";
import { Card } from "../ui/card";
import { Text } from "../ui/text";

interface Category {
  id: number;
  name: string;
  image_url?: string;
  children?: { id: number; name: string }[];
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect: (category: Category) => void;
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
      (cat) => cat.id === selectedCategoryId
    );
    const otherCategories = categories.filter(
      (cat) => cat.id !== selectedCategoryId
    );

    return selectedCategory
      ? [selectedCategory, ...otherCategories]
      : categories;
  }, [categories, selectedCategoryId]);

  const renderCategory = ({ item }: ListRenderItemInfo<Category>) => {
    const { name, id, image_url } = item;
    const isSelected = selectedCategoryId === id;

    return (
      <Pressable onPress={() => onCategorySelect(item)}>
        <Card
          className={`flex flex-row items-center p-2 ${
            isSelected ? "bg-primary/20 border-2 border-primary" : "bg-divider"
          }`}
        >
          {!!image_url && (
            <Image
              source={{ uri: image_url as string }}
              resizeMode="contain"
              className="w-8 h-8 mr-4"
            />
          )}

          <Text className={isSelected ? "font-semibold text-primary" : ""}>
            {name}
          </Text>
        </Card>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        data={sortedCategories}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={renderCategory}
        keyExtractor={(category) => String(category?.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};
