import React, { useRef } from "react";
import { View } from "react-native";
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from "../../../components/ui/carousel";
import type { DiscountStatsDto, ShopExtendedDto } from "../../../network/model";
import { StoreCard } from "./store-card";

interface StoreCarouselProps {
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  stats: DiscountStatsDto[];
  onStoreSelect: (storeId: number, index: number) => void;
  onSnapToItem: (index: number) => void;
}

export const StoreCarousel: React.FC<StoreCarouselProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
  onSnapToItem,
}) => {
  const carouselRef = useRef<any>(null);

  const handleStoreSelect = (storeId: number, index: number) => {
    onStoreSelect(storeId, index);
    // Center the selected card in the carousel
    const itemWidth = 300; // Should match the itemWidth prop of Carousel
    carouselRef.current?.scrollTo({
      x: index * itemWidth,
      animated: true,
    });
  };

  return (
    <View className="bg-background py-3">
      <Carousel
        ref={carouselRef}
        height={240}
        itemWidth={320}
        onSnapToItem={onSnapToItem}
        className="w-full"
      >
        {shops?.map((store, index) => (
          <CarouselItem key={store.id}>
            <StoreCard
              store={store}
              index={index}
              isActive={store?.id === activeStoreId}
              stats={stats}
              onPress={handleStoreSelect}
            />
          </CarouselItem>
        )) || []}
      </Carousel>

      <CarouselIndicators
        className="mt-3"
        indicatorClassName="bg-gray-300"
        activeIndicatorClassName="bg-primary scale-125"
      />
    </View>
  );
};
