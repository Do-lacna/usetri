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
    (category) => category?.category?.name?.toLowerCase() !== "root"
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
        renderItem={({ item, index }) => {
          const dataArray = isLoading ? skeletonData : filteredCategories;
          return (
            <View
              style={{
                flex:
                  dataArray.length % 2 !== 0 && index === dataArray.length - 1
                    ? 0
                    : 1,
                maxWidth: "48%",
                minWidth: "48%",
              }}
            >
              {isLoading ? (
                <SkeletonCategoryCard />
              ) : (
                <CategoryCard
                  category={item as PopularCategoryDto}
                  onPress={() => onCategorySelect(item as PopularCategoryDto)}
                />
              )}
            </View>
          );
        }}
        numColumns={2}
        keyExtractor={(item, index) =>
          isLoading
            ? `skeleton-${index}`
            : String((item as PopularCategoryDto)?.category?.id)
        }
        contentContainerStyle={{
          gap: 12,
          padding: 12,
          paddingBottom: 40, // Add extra bottom padding for navigation
        }}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 12,
        }}
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
