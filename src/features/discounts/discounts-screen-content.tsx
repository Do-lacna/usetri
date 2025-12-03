import type React from 'react';
import { useMemo, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetDiscounts,
  useGetDiscountsStatistics,
} from '~/src/network/query/query';
import DiscountList from './components/discount-list';
import { StoreCarousel } from './components/store-carousel';
import { useStoreSelection } from './hooks/use-store-selection';
import { formatDiscountValidity } from './utils/format-validity';
import { getStoreDisplayName } from './utils/store-utils';

export const DiscountsScreenContent: React.FC = () => {
  const {
    data: { stats = [] } = {},
    isLoading: areDiscountStatisticsLoading,
  } = useGetDiscountsStatistics();

  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  } = useStoreSelection(scrollY);

  // Fetch first discount to get validity dates
  const { data: discountsData } = useGetDiscounts(
    {
      restricted_shops: activeStoreId ? [Number(activeStoreId)] : undefined,
      Limit: 1,
      Offset: 0,
    },
    {
      query: {
        enabled: !!activeStoreId,
      },
    },
  );

  // Extract validity information from first discount
  const validityInfo = useMemo(() => {
    const firstProduct = discountsData?.products?.[0];
    const discountPrice = firstProduct?.shops_prices?.[0]?.discount_price;

    if (discountPrice?.valid_from || discountPrice?.valid_to) {
      return {
        validFrom: discountPrice.valid_from,
        validTo: discountPrice.valid_to,
      };
    }

    return null;
  }, [discountsData]);

  const SCROLL_DISTANCE = 150;
  const MIN_HEIGHT = 90;
  const MAX_HEIGHT = 240;

  const carouselHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <StoreCarousel
        shops={sortedShops}
        activeStoreId={activeStoreId}
        stats={stats || []}
        onStoreSelect={handleStoreSelect}
        onSnapToItem={handleSnapToItem}
        animatedHeight={carouselHeight}
        scrollY={scrollY}
      />

      {!!activeStore && (
        <View className="flex-1 bg-background">
          <View className="px-4 py-2">
            <Text className="text-2xl font-bold text-foreground">
              Zľavy v {getStoreDisplayName(activeStore.name)}
            </Text>
            {validityInfo && (
              <Text className="text-sm text-muted-foreground mt-1">
                {formatDiscountValidity(
                  validityInfo.validFrom,
                  validityInfo.validTo,
                )}
              </Text>
            )}
          </View>
          <DiscountList
            key={activeStoreId}
            shop={activeStore}
            onScroll={scrollY}
            validityInfo={validityInfo}
          />
        </View>
      )}

      <View className="bg-card px-4 py-3 border-t border-border">
        <Text className="text-center text-xs text-muted-foreground">
          Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
        </Text>
      </View>
    </SafeAreaView>
  );
};
