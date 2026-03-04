import { FlashList, type ListRenderItem as FlashListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, type ListRenderItem as FlatListRenderItem, Text, View } from 'react-native';
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

export function SubcategorySection({
  subcategory,
  onProductPress,
  isSubcategorySelected = false,
}: SubcategorySectionProps) {
  const { t } = useTranslation();
  const {
    data: { products: categoryProducts = [] } = {},
    isLoading,
  } = useGetProductsOutOfAllSubCategories(Number(subcategory?.id));

  const renderProductFlash: FlashListRenderItem<ProductDtoWithShopsPrices> = ({ item }) => (
    <DiscountedProductCard
      product={item as any}
      shopsPrices={item?.shops_prices}
      onPress={(productId, categoryId) => onProductPress(productId, categoryId)}
      className="flex-1"
    />
  );

  const renderProductFlat: FlatListRenderItem<ProductDtoWithShopsPrices> = ({ item }) => (
    <DiscountedProductCard
      product={item as any}
      shopsPrices={item?.shops_prices}
      onPress={(productId, categoryId) => onProductPress(productId, categoryId)}
      className="w-44"
    />
  );

  const renderSkeletonFlash: FlashListRenderItem<{ id: number }> = () => (
    <DiscountedProductCardSkeleton />
  );

  const renderSkeletonFlat: FlatListRenderItem<{ id: number }> = () => (
    <DiscountedProductCardSkeleton />
  );

  const hasProducts = (categoryProducts ?? []).length > 0;

  const skeletonList = isSubcategorySelected ? (
    <FlashList
      data={SKELETON_DATA}
      renderItem={renderSkeletonFlash}
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
    <FlashList
      data={categoryProducts}
      renderItem={renderProductFlash}
      numColumns={2}
      keyExtractor={(item, index) => String(item.detail?.id || index)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  ) : (
    <FlatList
      data={categoryProducts}
      renderItem={renderProductFlat}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => String(item.detail?.id || index)}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
    />
  );

  const emptyState = (
    <Text className="text-muted-foreground text-center py-4 px-4">
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
          <Text className="text-lg font-bold text-foreground">
            {subcategory.name}
          </Text>
        </View>
      )}

      {content}
    </View>
  );
}
