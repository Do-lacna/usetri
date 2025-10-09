import { FlatList, Text, View } from 'react-native';
import type {
  CategoryDto,
  ProductDtoWithShopsPrices,
} from '../../../network/model';
import { useGetProductsOutOfAllSubCategories } from '../../../network/query/query';
import { Skeleton } from '../../ui/skeleton';
import SuggestedProductCard from '../shopping-list/suggested-product-card';

interface SubcategorySectionProps {
  subcategory: CategoryDto;
  onProductPress: (barcode: string, categoryId: number) => void;
  isSubcategorySelected?: boolean; // New prop to indicate if this is a selected subcategory
}

export function SubcategorySection({
  subcategory,
  onProductPress,
  isSubcategorySelected = false, // Default to false for backward compatibility
}: SubcategorySectionProps) {
  const {
    data: { products: categoryProducts = [] } = {},
    isLoading,
  } = useGetProductsOutOfAllSubCategories(Number(subcategory?.id));

  const renderProduct = ({ item }: { item: ProductDtoWithShopsPrices }) => (
    <SuggestedProductCard
      product={item}
      shopsPrices={item?.shops_prices}
      onPress={(barcode, categoryId) => onProductPress(barcode, categoryId)}
    />
  );

  const renderSkeleton = ({ index }: { index: number }) => (
    <View key={index} className={isSubcategorySelected ? 'mb-3' : 'w-32 mr-3'}>
      <Skeleton
        className={`${isSubcategorySelected ? 'w-full h-24' : 'w-full h-32'} bg-card rounded-lg`}
      />
    </View>
  );

  return (
    <View className="mb-6">
      {/* Subcategory title */}
      <Text className="text-lg font-semibold text-foreground mb-3 px-4">
        {subcategory.name}
      </Text>

      {/* Products list - horizontal or vertical based on selection */}
      {isLoading ? (
        <View className={isSubcategorySelected ? 'px-4' : 'flex-row px-4'}>
          {Array.from({ length: isSubcategorySelected ? 6 : 3 }, (_, index) =>
            renderSkeleton({ index }),
          )}
        </View>
      ) : (categoryProducts ?? []).length > 0 ? (
        <FlatList
          data={categoryProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => String(item.detail?.barcode || index)}
          horizontal={!isSubcategorySelected}
          numColumns={isSubcategorySelected ? 2 : 1}
          key={isSubcategorySelected ? 'vertical' : 'horizontal'} // Force re-render when layout changes
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={isSubcategorySelected}
          scrollEnabled={isSubcategorySelected}
          contentContainerStyle={
            isSubcategorySelected
              ? { paddingHorizontal: 16, paddingBottom: 16 }
              : { paddingHorizontal: 16 }
          }
          columnWrapperStyle={
            isSubcategorySelected
              ? { justifyContent: 'space-between' }
              : undefined
          }
          ItemSeparatorComponent={
            isSubcategorySelected ? () => <View className="h-3" /> : undefined
          }
        />
      ) : (
        <Text className="text-muted-foreground text-center py-4 px-4">
          Žiadne produkty v tejto kategórii
        </Text>
      )}
    </View>
  );
}
