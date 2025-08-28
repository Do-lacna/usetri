import { FlatList, RefreshControl, Text, View } from "react-native";
import type { PopularCategoryDto } from "../../../network/model";
import { CategoryCard } from "./CategoryCard";
import { SkeletonCategoryCard } from "./SkeletonCategoryCard";

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
  // Filter out root category and create skeleton data
  const filteredCategories = categories.filter(
    category => category?.category?.name?.toLowerCase() !== 'root'
  );
  const skeletonData = Array.from({ length: 8 }, (_, index) => ({ id: index }));

  return (
    <View className="flex-1">
      <View className="mt-6 mb-4 px-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-foreground">
          Kategórie produktov
        </Text>
        {!isLoading && (
          <Text className="text-sm text-muted-foreground">
            {filteredCategories.length} kategórií
          </Text>
        )}
      </View>

      {/* Categories grid or skeleton */}
      <FlatList
        data={isLoading ? skeletonData : filteredCategories}
        renderItem={({ item }) =>
          isLoading ? (
            <SkeletonCategoryCard />
          ) : (
            <CategoryCard
              category={item as PopularCategoryDto}
              onPress={() => onCategorySelect(item as PopularCategoryDto)}
            />
          )
        }
        numColumns={2}
        keyExtractor={(item, index) =>
          isLoading ? `skeleton-${index}` : String((item as PopularCategoryDto)?.category?.id)
        }
        contentContainerStyle={{
          gap: 12,
          padding: 12,
          paddingBottom: 40 // Add extra bottom padding for navigation
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={!isLoading}
        refreshControl={
          !isLoading ? (
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}