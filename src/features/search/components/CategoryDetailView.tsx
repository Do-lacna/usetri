import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CategoryDto, PopularCategoryDto } from '~/src/network/model';
import { CategorySelector } from './CategorySelector';
import { SubcategorySection } from './SubcategorySection';

type CategoryDetailViewProps = Readonly<{
  selectedCategory: PopularCategoryDto;
  onBack: () => void;
  onProductPress: (productId: number, categoryId: number) => void;
}>;

export function CategoryDetailView({
  selectedCategory,
  onBack,
  onProductPress,
}: Readonly<CategoryDetailViewProps>) {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = React.useState<
    number | undefined
  >();
  const { t } = useTranslation();

  const handleSubcategorySelect = (subcategoryId: number | undefined) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const categoryName = selectedCategory?.category?.name ?? '';
  const hasSubcategories = (selectedCategory?.children?.length ?? 0) > 0;

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
      <View className="px-4 py-3 bg-background border-b border-border dark:border-border">
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`${t('back_to')} ${t('all_categories')}`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-card items-center justify-center mr-3 border border-border">
              <Ionicons name="chevron-back" size={22} />
            </View>

            <View className="flex-1">
              {/* Keep a single, non-duplicated context line */}
              <Text
                className="text-base font-semibold text-foreground"
                numberOfLines={1}
              >
                {categoryName || t('all_categories')}
                {hasSubcategories ? ` - ${t('subcategories_label')}` : ''}
              </Text>

              {/* Optional subtle hint about where back goes */}
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {t('all_categories')}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Category selector for subcategories */}
      <CategorySelector
        selectedCategory={selectedCategory}
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategorySelect={(subcategoryId, _subcategoryName) =>
          handleSubcategorySelect(subcategoryId)
        }
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
