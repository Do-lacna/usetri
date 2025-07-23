import { FlatList, RefreshControl, Text, View } from "react-native";
import type { PopularCategoryDto } from "../../network/model";
import { CategoryCard } from "./CategoryCard";

interface CategoriesGridProps {
  categories: PopularCategoryDto[];
  onCategorySelect: (category: PopularCategoryDto) => void;
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
        keyExtractor={(category) => String(category?.category?.id)}
        contentContainerStyle={{ gap: 8, padding: 8 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
