import { ScrollView, Text, View } from 'react-native';
import { CategorySelector } from './CategorySelector';
import { SubcategorySection } from './SubcategorySection';

interface CategoryDetailViewProps {
  selectedCategory: {
    id: number;
    name: string;
    children?: { id: number; name: string }[];
  };
  categories: {
    id: number;
    name: string;
    image_url?: string;
    children?: { id: number; name: string }[];
  }[];
  onBack: () => void;
  onProductPress: (barcode: string, categoryId: number) => void;
  onCategorySelect: (category: {
    id: number;
    name: string;
    image_url?: string;
    children?: { id: number; name: string }[];
  }) => void;
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
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategory.id}
        onCategorySelect={onCategorySelect}
      />

      {/* Subcategories with their products */}
      <ScrollView className="bg-gray-50">
        {selectedCategory.children && selectedCategory.children.length > 0 ? (
          selectedCategory.children.map((subcategory) => (
            <SubcategorySection
              key={subcategory.id}
              subcategory={subcategory}
              onProductPress={onProductPress}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">�</Text>
            <Text className="text-xl text-gray-600 text-center">
              Táto kategória nemá podkategórie
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
