import { Ionicons } from '@expo/vector-icons';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Pressable,
  FlatList as RNFlatList,
  Text,
  View,
} from 'react-native';
import type { CategoryDto, PopularCategoryDto } from '~/src/network/model';
import { CategorySelector } from './CategorySelector';
import { SubcategorySection } from './SubcategorySection';

const SELECTOR_MAX_HEIGHT = 88;
const SCROLL_HIDE_THRESHOLD = 40;

type CategoryDetailViewProps = Readonly<{
  selectedCategory: PopularCategoryDto;

  categories?: PopularCategoryDto[];
  onCategorySelect?: (category: PopularCategoryDto) => void;
  onBack: () => void;
  onProductPress: (productId: number, categoryId?: number) => void;
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
  const selectorHeight = React.useRef(
    new Animated.Value(SELECTOR_MAX_HEIGHT),
  ).current;
  const lastScrollY = React.useRef(0);

  const handleSubcategorySelect = (subcategoryId: number | undefined) => {
    setSelectedSubcategoryId(subcategoryId);
    // Reset selector visibility when changing subcategory
    Animated.spring(selectorHeight, {
      toValue: SELECTOR_MAX_HEIGHT,
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentY > lastScrollY.current;
    lastScrollY.current = currentY;

    if (isScrollingDown && currentY > SCROLL_HIDE_THRESHOLD) {
      Animated.timing(selectorHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (!isScrollingDown) {
      Animated.timing(selectorHeight, {
        toValue: SELECTOR_MAX_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
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
      <View className="px-4 py-3 bg-background border-b border-primary/15">
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
            <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center mr-3 border border-primary/25">
              <Ionicons name="chevron-back" size={22} color="#5645CC" />
            </View>

            <View className="flex-1">
              <Text
                className="text-base font-semibold text-foreground"
                numberOfLines={1}
              >
                {categoryName || t('all_categories')}
                {hasSubcategories ? ` - ${t('subcategories_label')}` : ''}
              </Text>

              <Text
                className="text-xs text-primary/60 font-medium"
                numberOfLines={1}
              >
                {t('all_categories')}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Animated collapsible category selector */}
      <Animated.View style={{ height: selectorHeight, overflow: 'hidden' }}>
        <CategorySelector
          selectedCategory={selectedCategory}
          selectedSubcategoryId={selectedSubcategoryId}
          onSubcategorySelect={(subcategoryId, _subcategoryName) =>
            handleSubcategorySelect(subcategoryId)
          }
        />
      </Animated.View>

      {/* Subcategories with their products */}
      {selectedSubcategoryId ? (
        <View className="bg-background flex-1">
          {subcategoriesToShow && subcategoriesToShow.length > 0 ? (
            <RNFlatList
              data={subcategoriesToShow}
              renderItem={({ item: subcategory }) => (
                <SubcategorySection
                  subcategory={subcategory}
                  onProductPress={onProductPress}
                  isSubcategorySelected={true}
                />
              )}
              keyExtractor={subcategory =>
                subcategory.id?.toString() || Math.random().toString()
              }
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
      ) : (
        <View className="bg-background flex-1">
          {subcategoriesToShow && subcategoriesToShow.length > 0 ? (
            <FlashList
              data={subcategoriesToShow}
              renderItem={renderSubcategoryItem}
              keyExtractor={subcategory =>
                subcategory.id?.toString() || Math.random().toString()
              }
              drawDistance={500}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              contentContainerStyle={{ flexGrow: 1 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
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
