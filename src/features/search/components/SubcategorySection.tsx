import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { Skeleton } from '~/src/components/ui/skeleton';
import SuggestedProductCard from '~/src/features/shopping-list/components/suggested-product-card';
import type {
  CategoryDto,
  ProductDtoWithShopsPrices,
} from '~/src/network/model';
import { useGetProductsOutOfAllSubCategories } from '~/src/network/query/query';

interface SubcategorySectionProps {
  subcategory: CategoryDto;
  onProductPress: (productId: number, categoryId: number) => void;
  isSubcategorySelected?: boolean;
}

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

  const renderProduct = ({ item }: { item: ProductDtoWithShopsPrices }) => (
    <SuggestedProductCard
      product={item}
      shopsPrices={item?.shops_prices}
      onPress={(productId, categoryId) => onProductPress(productId, categoryId)}
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
      <Text className="text-lg font-semibold text-foreground mb-3 px-4">
        {subcategory.name}
      </Text>

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
          keyExtractor={(item, index) => String(item.detail?.id || index)}
          horizontal={!isSubcategorySelected}
          numColumns={isSubcategorySelected ? 2 : 1}
          key={isSubcategorySelected ? 'vertical' : 'horizontal'} // Force re-render when layout changes
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={isSubcategorySelected}
          scrollEnabled={true}
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
          {t('no_products_in_category')}
        </Text>
      )}
    </View>
  );
}
