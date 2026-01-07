import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetDiscountsStatistics } from '~/src/network/query/query';
import DiscountList from './components/discount-list';
import { StoreCarousel } from './components/store-carousel';
import { useStoreSelection } from './hooks/use-store-selection';

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

  // Reset scroll position when shop changes
  useEffect(() => {
    scrollY.setValue(0);
  }, [activeStoreId, scrollY]);

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
          <DiscountList
            key={activeStoreId}
            shop={activeStore}
            onScroll={scrollY}
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
