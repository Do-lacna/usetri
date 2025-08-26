import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";
import type { DiscountShopItemDto, ShopExtendedDto } from "../../network/model";
import {
  getDiscounts,
  getGetDiscountsQueryKey,
} from "../../network/query/query";
import DiscountedProductCard from "../product-card/discounted-product-card";
import { Skeleton } from "../ui/skeleton";

export interface IDiscountListProps {
  shop: ShopExtendedDto;
}

interface SkeletonItem {
  id: number;
}

const DiscountList = ({ shop }: IDiscountListProps) => {
  const queryClient = useQueryClient();
  const { id, name } = shop;

  const LIMIT = 20; // Number of items to fetch per page

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
      const totalLoaded = allPages.length * LIMIT;
      return totalLoaded < (lastPage.count || 0) ? totalLoaded : undefined;
    },
    enabled: !!id,
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.products || []) || [];
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
    { length: 4 },
    (_, index) => ({ id: index })
  );

  const renderSkeletonItem: ListRenderItem<SkeletonItem> = ({
    item,
    index,
  }) => (
    <View className="flex-1 max-w-[50%]">
      <Skeleton className="w-full aspect-[4/3] bg-muted rounded-lg" />
    </View>
  );

  const renderProductItem: ListRenderItem<DiscountShopItemDto> = ({ item }) => (
    <DiscountedProductCard
      product={item}
      onPress={(id: string | number) => router.navigate(`/product/${id}`)}
      shopsPrices={item?.shops_prices}
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
          <FlatList
            data={skeletonData}
            renderItem={renderSkeletonItem}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="gap-4 p-1"
            columnWrapperClassName="gap-4"
            scrollEnabled={false}
          />
        ) : allProducts?.length === 0 ? (
          <Text
            className="text-muted-foreground text-base text-center mt-2"
            numberOfLines={2}
          >
            Tento obchod momentálne neponúka žiadne zľavnené produkty
          </Text>
        ) : (
          <FlatList
            data={allProducts}
            renderItem={renderProductItem}
            numColumns={2}
            keyExtractor={(product) => String(product?.detail?.barcode)}
            contentContainerClassName="gap-4 p-4"
            columnWrapperClassName="gap-4"
            refreshControl={
              <RefreshControl
                refreshing={isPending}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
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
