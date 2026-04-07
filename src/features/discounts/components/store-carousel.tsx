import type React from 'react';
import { useEffect, useRef } from 'react';
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
  collapseAnim?: Animated.Value;
}

export const StoreCarousel: React.FC<StoreCarouselProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
  onSnapToItem,
  animatedHeight,
  collapseAnim,
}) => {
  const carouselRef = useRef<any>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const CARD_WIDTH_PERCENTAGE = 0.75;
  const CARD_WIDTH = screenWidth * CARD_WIDTH_PERCENTAGE;
  const CARD_MARGIN = 8;

  const {
    itemWidth,
    horizontalPadding,
    handleStoreSelect: handleStoreSelectInternal,
  } = useCarouselAnimation({
    cardWidth: CARD_WIDTH,
    cardMargin: CARD_MARGIN,
    carouselRef,
  });

  const handleStoreSelect = (storeId: number, index: number) => {
    onStoreSelect(storeId, index);
    handleStoreSelectInternal(storeId, index);
  };

  const carouselViewRef = useRef<Animated.View>(null);
  const compactViewRef = useRef<Animated.View>(null);

  useEffect(() => {
    if (!collapseAnim) return;
    const listenerId = collapseAnim.addListener(({ value }) => {
      const collapsed = value > 0.5;
      (carouselViewRef.current as any)?.setNativeProps({
        pointerEvents: collapsed ? 'none' : 'auto',
      });
      (compactViewRef.current as any)?.setNativeProps({
        pointerEvents: collapsed ? 'auto' : 'none',
      });
    });
    return () => collapseAnim.removeListener(listenerId);
  }, [collapseAnim]);

  const carouselOpacity = collapseAnim
    ? collapseAnim.interpolate({
        inputRange: [0, 0.6],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const compactOpacity = collapseAnim
    ? collapseAnim.interpolate({
        inputRange: [0.4, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 0;

  return (
    <Animated.View
      className="bg-background border-border"
      style={{
        height: animatedHeight || 240,
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        ref={carouselViewRef}
        style={{
          opacity: carouselOpacity,
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
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
          indicatorClassName="bg-n5"
          activeIndicatorClassName="bg-primary scale-125"
        />
      </Animated.View>

      <Animated.View
        ref={compactViewRef}
        style={{
          opacity: compactOpacity,
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <CompactStoreRow
          shops={shops}
          activeStoreId={activeStoreId}
          onStoreSelect={handleStoreSelect}
        />
      </Animated.View>
    </Animated.View>
  );
};
