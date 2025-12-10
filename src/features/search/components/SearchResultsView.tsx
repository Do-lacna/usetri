import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { NoDataText } from '~/src/components/no-data-text/no-data-text';
import DiscountedProductCard from '~/src/components/product-card/discounted-product-card';
import type { ShopProductDto } from '~/src/network/model';

interface SearchResultsViewProps {
  products: ShopProductDto[];
  isLoading: boolean;
  onProductPress: (productId: number, categoryId?: number) => void;
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
      keyExtractor={product => String(product?.detail?.id)}
      contentContainerClassName="gap-4 py-12 px-2"
      columnWrapperClassName="gap-4"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
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
