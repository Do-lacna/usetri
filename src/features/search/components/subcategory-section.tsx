import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  type ListRenderItem as FlatListRenderItem,
  Text,
  View,
} from 'react-native';
import DiscountedProductCard from '~/src/components/product-card/discounted-product-card';
import { DiscountedProductCardSkeleton } from '~/src/components/product-card/discounted-product-card-skeleton';
import type {
  CategoryDto,
  ProductDtoWithShopsPrices,
} from '~/src/network/model';
import { useGetProductsOutOfAllSubCategories } from '~/src/network/query/query';

interface SubcategorySectionProps {
  readonly subcategory: CategoryDto;
  readonly onProductPress: (productId: number, categoryId: number) => void;
  readonly isSubcategorySelected?: boolean;
}

const SKELETON_DATA = Array.from({ length: 4 }, (_, i) => ({ id: i }));
const ItemSeparator = () => <View style={{ height: 12 }} />;

export const SubcategorySection = React.memo(function SubcategorySection({
  subcategory,
  onProductPress,
  isSubcategorySelected = false,
}: SubcategorySectionProps) {
  const { t } = useTranslation();
  const {
    data: { products: categoryProducts = [] } = {},
    isLoading,
  } = useGetProductsOutOfAllSubCategories(Number(subcategory?.id));

  const renderProductFlat: FlatListRenderItem<ProductDtoWithShopsPrices> =
    useCallback(
      ({ item }) => (
        <DiscountedProductCard
          product={item as any}
          shopsPrices={item?.shops_prices}
          onPress={onProductPress}
          className="w-44"
        />
      ),
      [onProductPress],
    );

  const renderSkeletonFlat: FlatListRenderItem<{ id: number }> = useCallback(
    () => <DiscountedProductCardSkeleton className="w-44" />,
    [],
  );

  const renderProductGrid: FlatListRenderItem<ProductDtoWithShopsPrices> =
    useCallback(
      ({ item }) => (
        <DiscountedProductCard
          product={item as any}
          shopsPrices={item?.shops_prices}
          onPress={onProductPress}
          className="flex-1"
        />
      ),
      [onProductPress],
    );

  const renderSkeletonGrid: FlatListRenderItem<{ id: number }> = useCallback(
    () => <DiscountedProductCardSkeleton className="flex-1" />,
    [],
  );

  const hasProducts = (categoryProducts ?? []).length > 0;

  const skeletonList = isSubcategorySelected ? (
    <FlatList
      data={SKELETON_DATA}
      renderItem={renderSkeletonGrid}
      numColumns={2}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      scrollEnabled={false}
    />
  ) : (
    <FlatList
      data={SKELETON_DATA}
      renderItem={renderSkeletonFlat}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
      scrollEnabled={false}
    />
  );

  const productList = isSubcategorySelected ? (
    <FlatList
      data={categoryProducts}
      renderItem={renderProductGrid}
      numColumns={2}
      keyExtractor={(item, index) => String(item.detail?.id || index)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
    />
  ) : (
    <FlatList
      data={categoryProducts}
      renderItem={renderProductFlat}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => String(item.detail?.id || index)}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={3}
    />
  );

  const emptyState = (
    <Text className="text-muted-foreground font-expose text-center py-4 px-4">
      {t('no_products_in_category')}
    </Text>
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = skeletonList;
  } else if (hasProducts) {
    content = productList;
  } else {
    content = emptyState;
  }

  return (
    <View className="mb-6">
      {!isSubcategorySelected && (
        <View className="flex-row items-center px-4 mb-3">
          <View className="w-1 h-5 bg-primary rounded-full mr-2" />
          <Text className="text-lg font-expose-bold text-foreground">
            {subcategory.name}
          </Text>
        </View>
      )}

      {content}
    </View>
  );
});
