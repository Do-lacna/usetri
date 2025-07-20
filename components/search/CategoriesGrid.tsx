import { FlatList, RefreshControl, Text, View } from "react-native";
import { CategoryCard } from "./CategoryCard";

interface CategoriesGridProps {
  categories: Array<{
    id: number;
    name: string;
    image_url?: string;
    children?: { id: number; name: string }[];
  }>;
  onCategorySelect: (category: {
    id: number;
    name: string;
    image_url?: string;
    children?: { id: number; name: string }[];
  }) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export function CategoriesGrid({
  categories,
  onCategorySelect,
  isLoading,
  onRefresh,
}: CategoriesGridProps) {
  console.log("CategoriesGrid rendering with", categories.length, "categories");

  return (
    <View>
      {/* Categories title */}
      <View className="mt-6 mb-4 px-2">
        <Text className="text-2xl font-bold text-gray-800">
          Kategórie produktov
        </Text>
      </View>

      {/* Categories grid */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => onCategorySelect(item)}
          />
        )}
        numColumns={3}
        keyExtractor={(category) => String(category?.id)}
        contentContainerStyle={{ gap: 8, padding: 8 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
