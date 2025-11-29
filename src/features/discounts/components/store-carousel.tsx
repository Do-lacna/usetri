import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from "../../../components/ui/carousel";
import type { DiscountStatsDto, ShopExtendedDto } from "~/src/network/model";
import { StoreCard } from "./store-card";

interface StoreCarouselProps {
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  stats: DiscountStatsDto[];
  onStoreSelect: (storeId: number, index: number) => void;
  onSnapToItem: (index: number) => void;
  animatedHeight?: Animated.AnimatedInterpolation<number>;
  animatedScale?: Animated.AnimatedInterpolation<number>;
  scrollY?: Animated.Value;
}

export const StoreCarousel: React.FC<StoreCarouselProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
  onSnapToItem,
  animatedHeight,
  animatedScale,
  scrollY,
}) => {
  const carouselRef = useRef<any>(null);
  const { width: screenWidth } = Dimensions.get("window");

  const CARD_WIDTH_PERCENTAGE = 0.75;
  const CARD_WIDTH = screenWidth * CARD_WIDTH_PERCENTAGE;
  const CARD_MARGIN = 8;

  const [currentScale, setCurrentScale] = useState(1);
  const [itemWidth, setItemWidth] = useState(CARD_WIDTH + CARD_MARGIN * 2);
  const [horizontalPadding, setHorizontalPadding] = useState(
    (screenWidth - (CARD_WIDTH + CARD_MARGIN * 2)) / 2
  );
  const [snapEnabled, setSnapEnabled] = useState(true);
  const previousPaddingRef = useRef(
    (screenWidth - (CARD_WIDTH + CARD_MARGIN * 2)) / 2
  );
  const previousItemWidthRef = useRef(CARD_WIDTH + CARD_MARGIN * 2);
  const isAdjustingScrollRef = useRef(false);
  const previousScaleRef = useRef(1);
  const hasAdjustedForScaleRef = useRef(false);

  const handleSnapToItemInternal = (index: number) => {
    if (!isAdjustingScrollRef.current) {
      onSnapToItem(index);
    }
  };

  useEffect(() => {
    if (animatedScale) {
      const listenerId = animatedScale.addListener(({ value }) => {
        setCurrentScale(value);
        const scaledWidth = CARD_WIDTH * value + CARD_MARGIN * 2 * value;
        const shouldSnapBeEnabled = value === 1;
        const centerPadding = (screenWidth - scaledWidth) / 2;
        const leftPadding = CARD_MARGIN * 2;
        const paddingInterpolation = value === 1 ? centerPadding : leftPadding;

        const isTransitioningToFullSize =
          previousScaleRef.current < 1 && value === 1;
        const isTransitioningToDownsized =
          previousScaleRef.current === 1 && value < 1;

        if (carouselRef.current && shops && activeStoreId) {
          const activeIndex = shops.findIndex((s) => s.id === activeStoreId);
          const baseItemWidth = CARD_WIDTH + CARD_MARGIN * 2;

          if (activeIndex >= 0 && isTransitioningToFullSize) {
            const newScrollX = activeIndex * scaledWidth;

            isAdjustingScrollRef.current = true;
            carouselRef.current.scrollTo({
              x: Math.max(0, newScrollX),
              animated: true,
            });
            setTimeout(() => {
              isAdjustingScrollRef.current = false;
            }, 350);
          } else if (activeIndex >= 0 && isTransitioningToDownsized) {
            const newScrollX = activeIndex * scaledWidth;

            isAdjustingScrollRef.current = true;
            carouselRef.current.scrollTo({
              x: Math.max(0, newScrollX),
              animated: false,
            });
            setTimeout(() => {
              isAdjustingScrollRef.current = false;
            }, 50);
          }
        }

        previousScaleRef.current = value;
        previousPaddingRef.current = paddingInterpolation;
        previousItemWidthRef.current = scaledWidth;
        setItemWidth(scaledWidth);
        setHorizontalPadding(paddingInterpolation);
        setSnapEnabled(shouldSnapBeEnabled);
      });
      return () => animatedScale.removeListener(listenerId);
    }
  }, [
    animatedScale,
    CARD_WIDTH,
    CARD_MARGIN,
    screenWidth,
    shops,
    activeStoreId,
  ]);

  const handleStoreSelect = (storeId: number, index: number) => {
    onStoreSelect(storeId, index);

    if (scrollY) {
      Animated.timing(scrollY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        const baseItemWidth = CARD_WIDTH + CARD_MARGIN * 2;
        setTimeout(() => {
          carouselRef.current?.scrollTo({
            x: index * baseItemWidth,
            animated: true,
          });
        }, 50);
      });
    } else {
      const scrollPosition =
        index * itemWidth - (horizontalPadding - CARD_MARGIN * 2);
      carouselRef.current?.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true,
      });
    }
  };

  return (
    <Animated.View
      className="bg-background"
      style={{
        height: animatedHeight || 240,
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <Carousel
        ref={carouselRef}
        height={240}
        itemWidth={itemWidth}
        snapToInterval={itemWidth}
        snapEnabled={snapEnabled}
        onSnapToItem={handleSnapToItemInternal}
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
              animatedScale={animatedScale}
            />
          </CarouselItem>
        )) || []}
      </Carousel>

      <Animated.View style={{ transform: [{ scale: animatedScale || 1 }] }}>
        <CarouselIndicators
          className="mt-3"
          indicatorClassName="bg-gray-300"
          activeIndicatorClassName="bg-primary scale-125"
        />
      </Animated.View>
    </Animated.View>
  );
};
