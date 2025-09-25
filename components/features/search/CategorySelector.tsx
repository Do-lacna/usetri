import React, { useEffect, useRef } from "react";
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
  const flatListRef = useRef<FlatList<PopularCategoryDto>>(null);

  // Auto-scroll to selected category when selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      const selectedIndex = categories.findIndex(
        (category) => category.category?.id === selectedCategoryId
      );

      if (selectedIndex !== -1) {
        // Try to scroll immediately, fallback handled by onScrollToIndexFailed
        flatListRef.current?.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: 0.5, // Center the item in the view
        });
      }
    }
  }, [selectedCategoryId, categories]);

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
        ref={flatListRef}
        horizontal
        data={categories}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={renderCategory}
        keyExtractor={(category) => String(category?.category?.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
        onScrollToIndexFailed={(info) => {
          // Fallback: scroll to offset if scrollToIndex fails
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          });
        }}
      />
    </View>
  );
};
