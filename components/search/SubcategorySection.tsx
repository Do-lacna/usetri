import React from "react";
import { FlatList, Text, View } from "react-native";
import type { CategoryDto, ShopItemDto } from "../../network/model";
import { useGetPopularCategoriesProducts } from "../../network/query/query";
import { Skeleton } from "../ui/skeleton";
import SuggestedProductCard from "../ui/suggested-product-card";

interface SubcategorySectionProps {
  subcategory: CategoryDto;
  onProductPress: (barcode: string, categoryId: number) => void;
}

export function SubcategorySection({
  subcategory,
  onProductPress,
}: SubcategorySectionProps) {
  const { data: { products: categoryProducts = [] } = {}, isLoading } =
    useGetPopularCategoriesProducts(Number(subcategory?.id));

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
      ) : (categoryProducts ?? []).length > 0 ? (
        <FlatList
          data={categoryProducts}
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
