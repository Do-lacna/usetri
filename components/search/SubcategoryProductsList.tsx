import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import DiscountedProductCard from '../../components/ui/product-card/discounted-product-card';
import { NoDataText } from '../../components/ui/no-data-text/no-data-text';
import type { ShopItemDto } from '../../network/model';

interface SubcategoryProductsListProps {
  subcategory: {
    id: number;
    name: string;
  };
  products: ShopItemDto[];
  isLoading: boolean;
  onProductPress: (id: string) => void;
}

export function SubcategoryProductsList({
  subcategory,
  products,
  isLoading,
  onProductPress,
}: SubcategoryProductsListProps) {
  return (
    <View className="mb-6">
      {/* Subcategory title */}
      <Text className="text-xl font-bold text-gray-800 mb-3 px-4">
        {subcategory.name}
      </Text>

      {/* Products horizontal list */}
      {isLoading ? (
        <View className="flex-row justify-center py-8">
          <ActivityIndicator animating={true} size="small" />
          <Text className="text-gray-500 ml-2">Načítavam produkty...</Text>
        </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="w-40 mr-3">
              <DiscountedProductCard
                product={item}
                onPress={onProductPress}
                availableShopIds={[1]}
              />
            </View>
          )}
          keyExtractor={(product) => String(product?.detail?.barcode)}
          contentContainerClassName="px-4"
        />
      ) : (
        <View className="py-8 px-4">
          <NoDataText className="text-center text-gray-500">
            Žiadne produkty v kategórii "{subcategory.name}"
          </NoDataText>
        </View>
      )}
    </View>
  );
}
