import type React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { NoDataText } from '~/src/components/no-data-text/no-data-text';
import DiscountedProductCard from '~/src/components/product-card/discounted-product-card';
import { Text } from '~/src/components/ui/text';
import { useGetProducts } from '~/src/network/query/query';

interface ShoppingListProductSearchProps {
  searchQuery: string;
  onProductSelect?: (productId: number) => void;
  ListHeaderComponent?: React.ReactElement;
}

const ShoppingListProductSearch: React.FC<ShoppingListProductSearchProps> = ({
  searchQuery,
  onProductSelect,
  ListHeaderComponent,
}) => {
  const { t } = useTranslation();
  const {
    data: { products: searchProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetProducts(
    {
      search: searchQuery,
      is_category_checked: true,
    },
    {
      query: {
        enabled: searchQuery?.length >= 2,
      },
    },
  );

  if (searchQuery?.length < 2) {
    return (
      <>
        {ListHeaderComponent}
        <Text className="mt-8 flex-1 flex items-center justify-center text-center text-muted-foreground font-expose w-[80%] mx-auto">
          {t('shopping_list_screen.start_typing')}
        </Text>
      </>
    );
  }

  const header = (
    <>
      {ListHeaderComponent}
      {(searchProducts ?? []).length > 0 && (
        <Text className="text-lg font-expose-bold mx-2 text-foreground">
          {t('shopping_list_screen.specific_products')}
        </Text>
      )}
    </>
  );

  return (
    <FlatList
      data={searchProducts}
      renderItem={({ item }) => (
        <DiscountedProductCard
          product={item}
          onPress={(productId, categoryId) => onProductSelect?.(productId)}
          shopsPrices={item?.shops_prices}
        />
      )}
      numColumns={2}
      keyExtractor={product => String(product?.detail?.id)}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerClassName="gap-4 p-1"
      columnWrapperClassName="gap-4"
      ListHeaderComponent={header}
      ListEmptyComponent={
        areProductsLoading ? (
          <ActivityIndicator animating={true} className="mt-10" />
        ) : (
          <View className="flex items-center justify-center">
            <NoDataText className="text-xl font-expose my-4">
              {t('shopping_list_screen.no_products_found')}
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
