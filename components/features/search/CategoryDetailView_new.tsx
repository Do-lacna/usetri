import { Pressable, ScrollView, Text, View } from "react-native";
import type { PopularCategoryDto } from "../../../network/model";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySection } from "./SubcategorySection";

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
  return (
    <View>
      {/* Back button and category title */}
      <View className="flex-row items-center mb-4 px-4 py-2 bg-white shadow-sm">
        <Pressable
          onPress={onBack}
          className="mr-3 p-2 bg-gray-100 rounded-full"
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-primary text-xl font-bold">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-gray-800">
          {selectedCategory?.category?.name}
        </Text>
      </View>

      {/* Category selector */}
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategory?.category?.id}
        onCategorySelect={onCategorySelect}
      />

      {/* Subcategories with their products */}
      <ScrollView className="bg-gray-50">
        {selectedCategory?.children && selectedCategory.children.length > 0 ? (
          selectedCategory.children.map((subcategory) => (
            <SubcategorySection
              key={subcategory.id}
              subcategory={subcategory}
              onProductPress={onProductPress}
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
