import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import DiscountedProductCard from '~/src/components/product-card/discounted-product-card';
import { DiscountedProductCardSkeleton } from '~/src/components/product-card/discounted-product-card-skeleton';
import type { ShopExtendedDto, ShopProductDto } from '~/src/network/model';
import {
  getDiscounts,
  getGetDiscountsQueryKey,
} from '~/src/network/query/query';
import { formatDiscountValidity } from '../utils/format-validity';
import { getStoreDisplayName } from '../utils/store-utils';

export interface IDiscountListProps {
  shop: ShopExtendedDto;
  onScroll?: Animated.Value;
}

interface SkeletonItem {
  id: number;
}

const LIMIT = 20; // Number of items to fetch per page

const DiscountList = ({ shop, onScroll }: IDiscountListProps) => {
  const { id, name } = shop;

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
      // Check if the current page returned LIMIT items (meaning there might be more)
      const currentPageProductsCount = lastPage?.products?.length ?? 0;
      if (currentPageProductsCount === LIMIT) {
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

  // Extract validity info from first product
  const validityInfo = React.useMemo(() => {
    const firstProduct = data?.pages?.[0]?.products?.[0];
    const discountPrice = firstProduct?.shops_prices?.[0]?.discount_price;

    if (discountPrice?.valid_from || discountPrice?.valid_to) {
      return {
        validFrom: discountPrice.valid_from ?? undefined,
        validTo: discountPrice.valid_to ?? undefined,
      };
    }
    return null;
  }, [data?.pages]);

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

  const renderSkeletonItem: ListRenderItem<SkeletonItem> = () => (
    <DiscountedProductCardSkeleton />
  );

  const renderProductItem: ListRenderItem<ShopProductDto> = ({ item }) => (
    <DiscountedProductCard
      product={item}
      onPress={(productId: number) => router.navigate(`/product/${productId}`)}
      shopsPrices={item?.shops_prices}
      className="flex-1"
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

  const renderHeader = () => (
    <View className="pb-3 flex-row items-center justify-between">
      <Text className="text-2xl font-bold text-foreground">
        Zľavy v {getStoreDisplayName(name)}
      </Text>
      {validityInfo && (
        <View className="bg-primary px-3 py-1 rounded-full">
          <Text className="text-sm font-semibold text-foreground">
            {formatDiscountValidity(
              validityInfo.validFrom,
              validityInfo.validTo,
            )}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      {isPending ? (
        <FlashList
          data={skeletonData}
          renderItem={renderSkeletonItem}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          scrollEnabled={false}
          estimatedItemSize={200}
          ListHeaderComponent={renderHeader}
        />
      ) : allProducts?.length === 0 ? (
        <View className="px-4 pt-4">
          {renderHeader()}
          <Text
            className="text-muted-foreground text-base text-center mt-2"
            numberOfLines={2}
          >
            Tento obchod momentálne neponúka žiadne zľavnené produkty
          </Text>
        </View>
      ) : (
        <FlashList
          data={allProducts}
          renderItem={renderProductItem}
          numColumns={2}
          keyExtractor={product => String(product?.detail?.id)}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl refreshing={isPending} onRefresh={handleRefresh} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text className="text-muted-foreground text-base text-center mt-4">
              Tento obchod momentálne neponúka žiadne zľavnené produkty
            </Text>
          }
          onScroll={
            onScroll
              ? Animated.event(
                  [{ nativeEvent: { contentOffset: { y: onScroll } } }],
                  { useNativeDriver: false },
                )
              : undefined
          }
          scrollEventThrottle={16}
          estimatedItemSize={200}
        />
      )}
    </View>
  );
};

export default DiscountList;
