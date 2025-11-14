import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import type { CategoryDto, PopularCategoryDto } from '~/src/network/model';
import { CategorySelector } from './CategorySelector';
import { SubcategorySection } from './SubcategorySection';

interface CategoryDetailViewProps {
  selectedCategory: PopularCategoryDto;
  categories: PopularCategoryDto[];
  onBack: () => void;
  onProductPress: (productId: number, categoryId: number) => void;
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
  const { t } = useTranslation();

  const handleSubcategorySelect = (
    subcategoryId: number | undefined,
    subcategoryName: string,
  ) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const subcategoriesToShow = selectedSubcategoryId
    ? selectedCategory?.children?.filter(
        sub => sub.id === selectedSubcategoryId,
      ) || []
    : selectedCategory?.children || [];

  const renderSubcategoryItem: ListRenderItem<CategoryDto> = ({
    item: subcategory,
  }) => (
    <SubcategorySection
      subcategory={subcategory}
      onProductPress={onProductPress}
      isSubcategorySelected={!!selectedSubcategoryId}
    />
  );

  return (
    <View className="flex-1">
      {/* Back Navigation Header */}
      <View className="flex-row items-center px-4 py-3 bg-background border-b border-border dark:border-border">
        <Pressable
          onPress={onBack}
          className="flex-row items-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View className="w-8 h-8 rounded-full bg-card items-center justify-center mr-3">
            <Text className="text-lg font-semibold text-muted-foreground">
              ←
            </Text>
          </View>
          <View>
            <Text className="text-sm text-muted-foreground">
              {t('back_to')}
            </Text>
            <Text className="text-lg font-semibold text-foreground">
              {t('all_categories')}
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
      {selectedSubcategoryId ? (
        <View className="bg-background flex-1">
          {subcategoriesToShow && subcategoriesToShow.length > 0 ? (
            subcategoriesToShow.map(subcategory => (
              <View key={subcategory.id} className="flex-1">
                <SubcategorySection
                  subcategory={subcategory}
                  onProductPress={onProductPress}
                  isSubcategorySelected={true}
                />
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📂</Text>
              <Text className="text-xl text-muted-foreground text-center">
                {t('category_no_subcategories')}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="bg-background flex-1">
          {subcategoriesToShow && subcategoriesToShow.length > 0 ? (
            <FlashList
              data={subcategoriesToShow}
              renderItem={renderSubcategoryItem}
              keyExtractor={subcategory =>
                subcategory.id?.toString() || Math.random().toString()
              }
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📂</Text>
              <Text className="text-xl text-muted-foreground text-center">
                {t('category_no_subcategories')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
