import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { useGetDiscounts } from '../../network/query/query';
import { Skeleton } from '../ui/skeleton';
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
    <View className="bg-card px-4 py-3 border-b border-border">
      <Text className="text-xl font-bold text-foreground">
        Najväčšie zľavy tohto týždňa
      </Text>
      <FlatList
        data={mostSaleProducts}
        renderItem={({ item }) => (
          <DiscountedMiniProductCard
            product={item}
            onPress={(id: string) => router.navigate(`/product/${id}`)}
            shopsPrices={item?.shops_prices}
          />
        )}
        keyExtractor={item => String(item?.detail?.barcode)}
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
