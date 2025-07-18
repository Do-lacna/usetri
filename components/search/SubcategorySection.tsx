import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useGetProducts } from '../../network/query/query';
import type { ShopItemDto } from '../../network/model';
import { Skeleton } from '../ui/skeleton';
import SuggestedProductCard from '../ui/suggested-product-card';

interface SubcategorySectionProps {
  subcategory: {
    id: number;
    name: string;
  };
  onProductPress: (barcode: string, categoryId: number) => void;
}

export function SubcategorySection({ subcategory, onProductPress }: SubcategorySectionProps) {
  const { data: { products: categoryProducts = [] } = {}, isLoading } = useGetProducts(
    {
      category_id: subcategory.id,
    },
    {
      query: {
        enabled: !!subcategory.id,
      },
    },
  );

  const products: ShopItemDto[] = categoryProducts?.map(({ products }: any) => products?.[0]).filter((product: any): product is ShopItemDto => Boolean(product)) || [];

  const renderProduct = ({ item }: { item: ShopItemDto }) => (
    <SuggestedProductCard
      product={item}
      availableShopIds={item.shop_id ? [item.shop_id] : []}
      onPress={(barcode, categoryId) => onProductPress(barcode, categoryId)}
      className="mr-3"
    />
  );

  const renderSkeleton = ({ index }: { index: number }) => (
    <View key={index} className="w-32 mr-3">
      <Skeleton className="w-full h-32 bg-gray-200 rounded-lg" />
    </View>
  );

  return (
    <View className="mb-6">
      {/* Subcategory title */}
      <Text className="text-lg font-semibold text-gray-800 mb-3 px-4">
        {subcategory.name}
      </Text>

      {/* Products horizontal list */}
      {isLoading ? (
        <View className="flex-row px-4">
          {Array.from({ length: 3 }, (_, index) => renderSkeleton({ index }))}
        </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item, index) => String(item.detail?.barcode || index)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <Text className="text-gray-500 text-center py-4 px-4">
          Žiadne produkty v tejto kategórii
        </Text>
      )}
    </View>
  );
}
