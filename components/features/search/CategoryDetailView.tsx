import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { PopularCategoryDto } from '../../../network/model';
import { CategorySelector } from './CategorySelector';
import { SubcategorySection } from './SubcategorySection';

interface CategoryDetailViewProps {
  selectedCategory: PopularCategoryDto;
  categories: PopularCategoryDto[];
  onBack: () => void;
  onProductPress: (barcode: string, categoryId: number) => void;
  onCategorySelect: (category: PopularCategoryDto) => void;
}

export function CategoryDetailView({
  selectedCategory,
  categories,
  onBack,
  onProductPress,
  onCategorySelect,
}: CategoryDetailViewProps) {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = React.useState<
    number | undefined
  >();

  const handleSubcategorySelect = (
    subcategoryId: number | undefined,
    subcategoryName: string,
  ) => {
    setSelectedSubcategoryId(subcategoryId);
    // Optionally scroll to the specific subcategory section
  };

  // Filter subcategories to show based on selection
  const subcategoriesToShow = selectedSubcategoryId
    ? selectedCategory?.children?.filter(
        sub => sub.id === selectedSubcategoryId,
      ) || []
    : selectedCategory?.children || [];

  return (
    <View className="flex-1">
      {/* Back Navigation Header */}
      <View className="flex-row items-center px-4 py-3 bg-background border-b border-gray-200 dark:border-gray-700">
        <Pressable
          onPress={onBack}
          className="flex-row items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mr-3">
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              ←
            </Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Späť na
            </Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Všetky kategórie
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Category selector for subcategories */}
      <CategorySelector
        selectedCategory={selectedCategory}
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategorySelect={handleSubcategorySelect}
      />

      {/* Subcategories with their products */}
      <ScrollView className="bg-background flex-1">
        {subcategoriesToShow && subcategoriesToShow.length > 0 ? (
          subcategoriesToShow.map(subcategory => (
            <SubcategorySection
              key={subcategory.id}
              subcategory={subcategory}
              onProductPress={onProductPress}
              isSubcategorySelected={!!selectedSubcategoryId}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">📂</Text>
            <Text className="text-xl text-gray-600 text-center">
              Táto kategória nemá podkategórie
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
