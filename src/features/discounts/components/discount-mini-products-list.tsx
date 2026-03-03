import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { Skeleton } from '~/src/components/ui/skeleton';
import { useGetDiscounts } from '~/src/network/query/query';
import DiscountedMiniProductCard from './discounted-mini-product-card';

interface SkeletonItem {
  id: number;
}

const DiscountMiniProductsList = () => {
  const {
    data: { products: mostSaleProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetDiscounts();

  if (!areProductsLoading && mostSaleProducts?.length === 0) {
    return null;
  }

  return (
    <View className="bg-background px-4 py-3 border-b border-border">
      <View className="flex-row items-center mb-2">
        {/* Yellow accent bar — secondary signal */}
        <View className="w-1 h-6 bg-g1 rounded-full mr-2" />
        <Text className="text-xl font-bold text-foreground">
          Najväčšie zľavy tohto týždňa
        </Text>
      </View>
      <FlatList
        data={mostSaleProducts}
        renderItem={({ item }) => (
          <DiscountedMiniProductCard
            product={item}
            onPress={(productId: number) =>
              router.navigate(`/product/${productId}`)
            }
            shopsPrices={item?.shops_prices}
          />
        )}
        keyExtractor={item => String(item?.detail?.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 4 }}
        ListEmptyComponent={
          <View className="flex-row">
            {[1, 2, 3, 4].map((item, index) => (
              <View className="flex-1 max-w-32 mx-2" key={item}>
                <Skeleton className="w-full aspect-[4/3] bg-muted rounded-lg" />
              </View>
            ))}
          </View>
        }
      />
    </View>
  );
};

export default DiscountMiniProductsList;
