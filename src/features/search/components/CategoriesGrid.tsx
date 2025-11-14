import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import type { PopularCategoryDto } from '~/src/network/model';
import { CategoryCard } from './CategoryCard';
import { SkeletonCategoryCard } from './SkeletonCategoryCard';

interface CategoriesGridProps {
  categories: PopularCategoryDto[];
  onCategorySelect: (category: PopularCategoryDto) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

// Define a union type for the list items
type SkeletonItem = { id: string; isSkeleton: true };
type CategoryItem = { data: PopularCategoryDto; isSkeleton: false };
type ListItem = SkeletonItem | CategoryItem;

export function CategoriesGrid({
  categories,
  onCategorySelect,
  isLoading,
  onRefresh,
}: CategoriesGridProps) {
  const { t } = useTranslation();
  const filteredCategories = categories.filter(
    category => category?.category?.name?.toLowerCase() !== 'root',
  );

  // Create properly typed data array
  const listData: ListItem[] = isLoading
    ? Array.from({ length: 8 }, (_, index) => ({
        id: `skeleton-${index}`,
        isSkeleton: true as const,
      }))
    : filteredCategories.map(category => ({
        data: category,
        isSkeleton: false as const,
      }));

  return (
    <View className="flex-1">
      <View className="mt-6 mb-4 px-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-foreground">
          {t('categories_title')}
        </Text>
        {!isLoading && (
          <Text className="text-sm text-muted-foreground">
            {t('categories_count', { count: filteredCategories.length })}
          </Text>
        )}
      </View>

      {/* Categories grid or skeleton */}
      <FlatList
        data={listData}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flex:
                  listData.length % 2 !== 0 && index === listData.length - 1
                    ? 0
                    : 1,
                maxWidth: '48%',
                minWidth: '48%',
              }}
            >
              {item.isSkeleton ? (
                <SkeletonCategoryCard />
              ) : (
                <CategoryCard
                  category={item.data}
                  onPress={() => onCategorySelect(item.data)}
                />
              )}
            </View>
          );
        }}
        numColumns={2}
        keyExtractor={item =>
          item.isSkeleton ? item.id : String(item.data.category?.id)
        }
        contentContainerStyle={{
          gap: 12,
          padding: 12,
          paddingBottom: 40, // Add extra bottom padding for navigation
        }}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
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
