import type React from "react";
import { useRef } from "react";
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
}

export const StoreCarousel: React.FC<StoreCarouselProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
  onSnapToItem,
  animatedHeight,
  animatedScale,
}) => {
  const carouselRef = useRef<any>(null);
  const { width: screenWidth } = Dimensions.get("window");

  // Card takes 75% of screen width, leaving 12.5% visible on each side
  const CARD_WIDTH_PERCENTAGE = 0.75;
  const CARD_WIDTH = screenWidth * CARD_WIDTH_PERCENTAGE;

  // Add margins to create spacing between cards
  const CARD_MARGIN = 8;
  const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

  const handleStoreSelect = (storeId: number, index: number) => {
    onStoreSelect(storeId, index);
    // Center the selected card in the carousel
    carouselRef.current?.scrollTo({
      x: index * ITEM_WIDTH,
      animated: true,
    });
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
        itemWidth={ITEM_WIDTH}
        onSnapToItem={onSnapToItem}
        className="w-full"
      >
        {shops?.map((store, index) => (
          <CarouselItem key={store.id}>
            <View style={{ alignItems: "flex-start", width: ITEM_WIDTH }}>
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
            </View>
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
