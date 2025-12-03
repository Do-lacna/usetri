import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import type { DiscountStatsDto, ShopExtendedDto } from '~/src/network/model';
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from '../../../components/ui/carousel';
import { useCarouselAnimation } from '../hooks/use-carousel-animation';
import { CompactStoreRow } from './compact-store-row';
import { StoreCard } from './store-card';

interface StoreCarouselProps {
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  stats: DiscountStatsDto[];
  onStoreSelect: (storeId: number, index: number) => void;
  onSnapToItem: (index: number) => void;
  animatedHeight?: Animated.AnimatedInterpolation<number>;
  scrollY?: Animated.Value;
}

const COLLAPSE_THRESHOLD = 150; // Height below which to show compact row

export const StoreCarousel: React.FC<StoreCarouselProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
  onSnapToItem,
  animatedHeight,
  scrollY,
}) => {
  const carouselRef = useRef<any>(null);
  const { width: screenWidth } = Dimensions.get('window');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const CARD_WIDTH_PERCENTAGE = 0.75;
  const CARD_WIDTH = screenWidth * CARD_WIDTH_PERCENTAGE;
  const CARD_MARGIN = 8;

  // Get fixed layout values from simplified hook
  const {
    itemWidth,
    horizontalPadding,
    handleStoreSelect: handleStoreSelectInternal,
  } = useCarouselAnimation({
    cardWidth: CARD_WIDTH,
    cardMargin: CARD_MARGIN,
    scrollY,
    carouselRef,
  });

  /**
   * Handle store selection - coordinate with parent and internal logic
   */
  const handleStoreSelect = (storeId: number, index: number) => {
    onStoreSelect(storeId, index);
    handleStoreSelectInternal(storeId, index);
  };

  // Monitor scroll position to determine if we should show compact view
  useEffect(() => {
    if (!scrollY) return;

    const listenerId = scrollY.addListener(({ value }) => {
      const shouldCollapse = value > COLLAPSE_THRESHOLD;
      setIsCollapsed(shouldCollapse);
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);

  // Calculate opacity for smooth transition between views
  const carouselOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [COLLAPSE_THRESHOLD - 20, COLLAPSE_THRESHOLD],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const compactOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [COLLAPSE_THRESHOLD - 20, COLLAPSE_THRESHOLD],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 0;

  return (
    <Animated.View
      className="bg-background"
      style={{
        height: animatedHeight || 240,
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      {/* Carousel view - visible when expanded */}
      <Animated.View
        style={{
          opacity: carouselOpacity,
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: isCollapsed ? 'none' : 'auto',
        }}
      >
        <Carousel
          ref={carouselRef}
          height={240}
          itemWidth={itemWidth}
          snapToInterval={itemWidth}
          snapEnabled={true}
          onSnapToItem={onSnapToItem}
          className="w-full"
          contentPadding={horizontalPadding}
        >
          {shops?.map((store, index) => (
            <CarouselItem key={store.id} style={{ width: itemWidth }}>
              <StoreCard
                store={store}
                index={index}
                isActive={store?.id === activeStoreId}
                stats={stats}
                onPress={handleStoreSelect}
                cardWidth={CARD_WIDTH}
                animatedHeight={animatedHeight}
              />
            </CarouselItem>
          )) || []}
        </Carousel>

        <CarouselIndicators
          className="mt-3"
          indicatorClassName="bg-gray-300"
          activeIndicatorClassName="bg-primary scale-125"
        />
      </Animated.View>

      {/* Compact row view - visible when collapsed */}
      <Animated.View
        style={{
          opacity: compactOpacity,
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          pointerEvents: isCollapsed ? 'auto' : 'none',
        }}
      >
        <CompactStoreRow
          shops={shops}
          activeStoreId={activeStoreId}
          stats={stats}
          onStoreSelect={handleStoreSelect}
        />
      </Animated.View>
    </Animated.View>
  );
};
