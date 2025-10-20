import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import DiscountedProductCard from '~/components/product-card/discounted-product-card';
import type { ShopProductDto } from '~/network/model';
import { NoDataText } from '../../no-data-text/no-data-text';

interface SearchResultsViewProps {
  products: ShopProductDto[];
  isLoading: boolean;
  onProductPress: (barcode: string, categoryId?: number) => void;
  onRefresh: () => void;
}

export const SearchResultsView = ({
  products,
  isLoading,
  onProductPress,
  onRefresh,
}: SearchResultsViewProps) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <DiscountedProductCard
          product={item}
          onPress={onProductPress}
          shopsPrices={item?.shops_prices || []}
        />
      )}
      numColumns={3}
      keyExtractor={product => String(product?.detail?.barcode)}
      contentContainerClassName="gap-4 py-12 px-2"
      columnWrapperClassName="gap-4"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        !isLoading ? (
          <ActivityIndicator animating={true} className="mt-12" />
        ) : (
          <View className="flex-1 flex items-center justify-center">
            <NoDataText className="text-xl my-4">Žiadne výsledky</NoDataText>
          </View>
        )
      }
    />
  );
};
