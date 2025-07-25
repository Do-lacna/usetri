import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useGetProducts } from "../../../network/query/query";
import { NoDataText } from "../no-data-text/no-data-text";
import DiscountedProductCard from "../product-card/discounted-product-card";
import { Text } from "../text";

interface ShoppingListProductSearchProps {
  searchQuery: string;
  onProductSelect?: (barcode: string) => void;
}

const ShoppingListProductSearch: React.FC<ShoppingListProductSearchProps> = ({
  searchQuery,
  onProductSelect,
}) => {
  const {
    data: { products: searchProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length > 2,
      },
    }
  );

  if (!(searchQuery?.length > 0)) {
    return (
      <Text className="flex-1 flex items-center justify-center text-center">
        Začni písať pre vyhľadanie produktu alebo kategórie
      </Text>
    );
  }

  return (
    <FlatList
      data={searchProducts}
      renderItem={({ item }) => (
        <DiscountedProductCard
          product={item}
          onPress={onProductSelect}
          shopsPrices={item?.shops_prices}
        />
      )}
      numColumns={2}
      keyExtractor={(product) => String(product?.detail?.barcode)}
      contentContainerClassName="gap-4 p-1"
      columnWrapperClassName="gap-4"
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={isLoading}
      //       onRefresh={() => queryClient.invalidateQueries()}
      //     />
      //   }
      ListEmptyComponent={
        areProductsLoading ? (
          <ActivityIndicator animating={true} className="mt-10" />
        ) : (
          <View className="flex items-center justify-center">
            {/* TODO add nicer no data screen with picture */}
            <NoDataText className="text-xl my-4">
              Nenašli sa žiadne produkty
            </NoDataText>
          </View>
        )
      }
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 250,
      }}
    />
  );
};

export default ShoppingListProductSearch;
