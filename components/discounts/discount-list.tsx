import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, RefreshControl, Text, View } from 'react-native';
import type { ShopExtendedDto, ShopProductDto } from '../../network/model';
import {
  getDiscounts,
  getGetDiscountsQueryKey,
} from '../../network/query/query';
import DiscountedProductCard from '../product-card/discounted-product-card';
import { Skeleton } from '../ui/skeleton';

export interface IDiscountListProps {
  shop: ShopExtendedDto;
}

interface SkeletonItem {
  id: number;
}

const LIMIT = 20; // Number of items to fetch per page

const DiscountList = ({ shop }: IDiscountListProps) => {
  const { id } = shop;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: getGetDiscountsQueryKey({ restricted_shops: [Number(id)] }),
    queryFn: ({ pageParam = 0 }) =>
      getDiscounts({
        restricted_shops: [Number(id)],
        Limit: LIMIT,
        Offset: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.count === LIMIT) {
        return allPages?.length * LIMIT;
      }
      return undefined;
    },
    enabled: !!id,
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products || []) || [];
  }, [data]);

  const loadMoreData = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // Create skeleton data that matches FlatList structure
  const skeletonData: SkeletonItem[] = Array.from(
    { length: 6 },
    (_, index) => ({ id: index }),
  );

  const renderSkeletonItem: ListRenderItem<SkeletonItem> = ({ item }) => (
    <View className="flex-1 px-1 mb-4">
      <View className="bg-card rounded-xl p-2 shadow-sm shadow-foreground/10">
        {/* Image skeleton */}
        <View className="w-full h-32 rounded-lg relative">
          <Skeleton className="w-full h-32 rounded-lg bg-muted" />

          {/* Shop logo badges skeleton at bottom of image */}
          <View className="absolute bottom-4 flex-row gap-x-2">
            <Skeleton className="w-5 h-5 rounded-full bg-muted" />
            <Skeleton className="w-5 h-5 rounded-full bg-muted" />
          </View>
        </View>

        {/* Unit badge skeleton (top-left) */}
        <View className="absolute top-2 left-2">
          <Skeleton className="w-16 h-6 rounded-md bg-muted" />
        </View>

        {/* Discount badge skeleton (top-right) */}
        <View className="absolute top-2 right-2">
          <Skeleton className="w-12 h-6 rounded-md bg-muted" />
        </View>

        {/* Product info skeleton */}
        <View className="mt-2 space-y-1">
          {/* Brand */}
          <Skeleton className="w-20 h-3 rounded bg-muted" />
          {/* Product name */}
          <Skeleton className="w-full h-4 rounded bg-muted mt-1" />
          {/* Price */}
          <Skeleton className="w-16 h-4 rounded bg-muted mt-1" />
        </View>
      </View>
    </View>
  );

  const renderProductItem: ListRenderItem<ShopProductDto> = ({ item }) => (
    <DiscountedProductCard
      product={item}
      onPress={(id: string | number) => router.navigate(`/product/${id}`)}
      shopsPrices={item?.shops_prices}
      className="mb-4"
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View>
      <View className="flex-row">
        {isPending ? (
          <FlashList
            data={skeletonData}
            renderItem={renderSkeletonItem}
            numColumns={2}
            keyExtractor={item => String(item.id)}
            contentContainerClassName="gap-2 p-4"
            scrollEnabled={false}
          />
        ) : allProducts?.length === 0 ? (
          <Text
            className="text-muted-foreground text-base text-center mt-2 px-4"
            numberOfLines={2}
          >
            Tento obchod momentálne neponúka žiadne zľavnené produkty
          </Text>
        ) : (
          <FlashList
            data={allProducts}
            renderItem={renderProductItem}
            numColumns={2}
            keyExtractor={product => String(product?.detail?.barcode)}
            contentContainerClassName="gap-2 p-4"
            refreshControl={
              <RefreshControl
                refreshing={isPending}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Text className="text-muted-foreground text-base text-center mt-4">
                Tento obchod momentálne neponúka žiadne zľavnené produkty
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default DiscountList;
