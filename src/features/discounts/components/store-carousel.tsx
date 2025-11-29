import type React from "react";
import { useRef } from "react";
import { Animated, Dimensions } from "react-native";
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from "../../../components/ui/carousel";
import type { DiscountStatsDto, ShopExtendedDto } from "~/src/network/model";
import { useCarouselAnimation } from "../hooks/use-carousel-animation";
import { StoreCard } from "./store-card";

interface StoreCarouselProps {
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  stats: DiscountStatsDto[];
  onStoreSelect: (storeId: number, index: number) => void;
  onSnapToItem: (index: number) => void;
  animatedHeight?: Animated.AnimatedInterpolation<number>;
  scrollY?: Animated.Value;
}

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
  const { width: screenWidth } = Dimensions.get("window");

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
  );
};
