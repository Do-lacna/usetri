import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "../../../../components/discounts/discount-list";
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from "../../../../components/ui/carousel";
import { isArrayNotEmpty } from "../../../../lib/utils";
import type {
  DiscountStatsDto,
  ShopExtendedDto,
} from "../../../../network/model";
import {
  useGetDiscountsStatistics,
  useGetShops,
} from "../../../../network/query/query";

const GroceryDiscountsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { data: { shops } = {}, isLoading: areShopsLoading } = useGetShops();
  const carouselRef = useRef<any>(null);

  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  );

  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();

  const getStoreDiscountsCount = (
    storeId: number,
    stats: DiscountStatsDto[] | null
  ) => {
    return (
      stats?.find((stat) => stat.shop_id === storeId)?.valid_discounts_count ||
      0
    );
  };

  React.useEffect(() => {
    if (isArrayNotEmpty(shops) && !activeStoreId) {
      const sortedShops = shops?.sort(
        ({ id: firstStoreId = 0 }, { id: secondStoreId = 0 }) =>
          getStoreDiscountsCount(secondStoreId, stats) -
          getStoreDiscountsCount(firstStoreId, stats)
      );
      setActiveStoreId(Number(sortedShops?.[0]?.id));
    }
  }, [shops, stats, activeStoreId]);

  const handleStoreSelect = (storeId: number, index: number) => {
    setActiveStoreId(storeId);
    // Center the selected card in the carousel
    const itemWidth = 320; // Should match the itemWidth prop of Carousel
    carouselRef.current?.scrollTo({
      x: index * itemWidth,
      animated: true,
    });
  };

  const renderStoreCard = (store: ShopExtendedDto, index: number) => {
    const isActive = store?.id === activeStoreId;
    const discountCount = getStoreDiscountsCount(Number(store?.id), stats);
    const storeImage = getStoreImage(store.name);

    return (
      <TouchableOpacity
        key={store.id}
        onPress={() => handleStoreSelect(Number(store?.id), index)}
        className={
          isActive
            ? "w-80 h-48 mx-2 rounded-xl overflow-hidden opacity-100 scale-100 shadow-lg"
            : "w-80 h-48 mx-2 rounded-xl overflow-hidden opacity-60 scale-95 shadow-sm"
        }
      >
        <ImageBackground
          source={storeImage}
          className="flex-1"
          resizeMode="cover"
        >
          {/* Dark overlay - stronger for inactive cards */}
          <View
            className={
              isActive
                ? "absolute inset-0 bg-black/30"
                : "absolute inset-0 bg-black/50"
            }
          />

          {/* Store Name */}
          <View className="absolute bottom-3 left-4">
            <Text
              className={
                isActive
                  ? "font-bold text-white text-lg"
                  : "font-bold text-white/80 text-base"
              }
            >
              {getStoreDisplayName(store.name)}
            </Text>
            {discountCount > 0 && (
              <Text
                className={
                  isActive
                    ? "mt-1 text-white/90 text-sm"
                    : "mt-1 text-white/70 text-xs"
                }
              >
                {discountCount} zliav
              </Text>
            )}
          </View>

          {/* Active State Indicator */}
          {isActive && (
            <>
              <View className="absolute inset-0 border-4 border-primary rounded-xl" />
              <View className="absolute top-3 right-3 w-4 h-4 bg-primary rounded-full shadow-lg" />
            </>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  // Helper function to get store image sources
  const getStoreImage = (storeName?: string | null) => {
    if (!storeName)
      return require("../../../../assets/images/store-pictures/billa.png");
    const name = storeName.toLowerCase();
    if (name.includes("billa"))
      return require("../../../../assets/images/store-pictures/billa.png");
    if (name.includes("kaufland"))
      return require("../../../../assets/images/store-pictures/kaufland.png");
    if (name.includes("lidl"))
      return require("../../../../assets/images/store-pictures/lidl.png");
    if (name.includes("tesco"))
      return require("../../../../assets/images/store-pictures/tesco.jpg");
    return require("../../../../assets/images/store-pictures/billa.png"); // fallback
  };

  // Helper function to get clean store display names
  const getStoreDisplayName = (storeName?: string | null): string => {
    if (!storeName) return "Store";
    const name = storeName.toLowerCase();
    if (name.includes("billa")) return "Billa";
    if (name.includes("kaufland")) return "Kaufland";
    if (name.includes("lidl")) return "Lidl";
    if (name.includes("tesco")) return "Tesco";
    return storeName;
  };

  const sortedShops = shops?.sort(
    ({ id: firstStoreId = 0 }, { id: secondStoreId = 0 }) =>
      getStoreDiscountsCount(secondStoreId, stats) -
      getStoreDiscountsCount(firstStoreId, stats)
  );

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      {/* Store Carousel */}
      <View className="bg-background py-3">
        <Carousel
          ref={carouselRef}
          height={240}
          itemWidth={320}
          onSnapToItem={(index) => {
            const store = sortedShops?.[index];
            if (store) {
              setActiveStoreId(Number(store.id));
            }
          }}
          className="w-full"
        >
          {sortedShops?.map((store, index) => (
            <CarouselItem key={store.id}>
              {renderStoreCard(store, index)}
            </CarouselItem>
          )) || []}
        </Carousel>

        <CarouselIndicators
          className="mt-3"
          indicatorClassName="bg-gray-300"
          activeIndicatorClassName="bg-primary scale-125"
        />
      </View>

      {/* Active Store Content */}
      {!!activeStore && (
        <View className="flex-1 bg-background">
          <View className="px-4 py-2">
            <Text className="text-2xl font-bold text-foreground">
              Zľavy v {getStoreDisplayName(activeStore.name)}
            </Text>
          </View>
          <DiscountList shop={activeStore} />
        </View>
      )}

      {/* Footer */}
      <View className="bg-card px-4 py-3 border-t border-border">
        <Text className="text-center text-xs text-muted-foreground">
          Ceny a dostupnosť sa môžu líšiť v jednotlivých predajniach
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default GroceryDiscountsScreen;
