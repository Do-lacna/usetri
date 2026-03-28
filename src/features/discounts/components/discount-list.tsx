import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  type Animated,
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
  limitItems?: number;
  guestScrollLimit?: number;
  onGuestScrollLimitReached?: () => void;
  isGuest?: boolean;
  onProductPressBlocked?: () => void;
}

interface SkeletonItem {
  id: number;
}

const LIMIT = 20; // Number of items to fetch per page

const DiscountList = ({
  shop,
  onScroll,
  limitItems,
  guestScrollLimit,
  onGuestScrollLimitReached,
  isGuest,
  onProductPressBlocked,
}: IDiscountListProps) => {
  const { t } = useTranslation();
  const { id, name } = shop;
  const scrollLimitReachedRef = React.useRef(false);

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

  const allProducts = React.useMemo(() => {
    const products = data?.pages.flatMap(page => page.products || []) || [];
    return limitItems ? products.slice(0, limitItems) : products;
  }, [data, limitItems]);

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
    if (limitItems) return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, limitItems]);

  const handleRefresh = React.useCallback(() => {
    if (limitItems) return;
    refetch();
  }, [refetch, limitItems]);

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
      selectedShopId={Number(id)}
      onPress={(productId: number) => {
        if (isGuest && onProductPressBlocked) {
          onProductPressBlocked();
        } else {
          router.navigate(`/product/${productId}`);
        }
      }}
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
      <Text className="text-2xl font-expose-bold text-foreground">
        {t('discount_list.discounts_in', {
          storeName: getStoreDisplayName(name),
        })}
      </Text>
      {validityInfo && (
        <View className="bg-v1 px-3 py-2 rounded-full ">
          <Text className="text-xs font-expose-medium text-white">
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
    <View className="flex-1 bg-background">
      {isPending ? (
        <FlashList
          data={skeletonData}
          renderItem={renderSkeletonItem}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          scrollEnabled={false}
          ListHeaderComponent={renderHeader}
        />
      ) : allProducts?.length === 0 ? (
        <View className="px-4 pt-4">
          {renderHeader()}
          <Text
            className="text-muted-foreground font-sans text-base text-center mt-2"
            numberOfLines={2}
          >
            {t('discount_list.no_discounts')}
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
            limitItems ? undefined : (
              <RefreshControl
                refreshing={isPending}
                onRefresh={handleRefresh}
              />
            )
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text className="text-muted-foreground text-base text-center mt-4 font-sans">
              {t('discount_list.no_discounts')}
            </Text>
          }
          onScroll={event => {
            const scrollPosition = event.nativeEvent.contentOffset.y;

            if (
              guestScrollLimit &&
              onGuestScrollLimitReached &&
              scrollPosition >= guestScrollLimit &&
              !scrollLimitReachedRef.current
            ) {
              scrollLimitReachedRef.current = true;
              onGuestScrollLimitReached();
            }

            if (onScroll) {
              onScroll.setValue(scrollPosition);
            }
          }}
          scrollEventThrottle={32}
        />
      )}
    </View>
  );
};

export default DiscountList;
