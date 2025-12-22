import type React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  SlideInLeft,
  SlideInRight,
  runOnJS,
} from 'react-native-reanimated';
import { Text } from '~/src/components/ui/text';
import { ActionButtons } from '~/src/features/shop-comparison/components/action-buttons';
import { PriceSummaryCard } from '~/src/features/shop-comparison/components/price-summary-card';
import { ProductsList } from '~/src/features/shop-comparison/components/products-list';
import { ShopNavigationHeader } from '~/src/features/shop-comparison/components/shop-navigation-header';
import { ShopPagination } from '~/src/features/shop-comparison/components/shop-pagination';
import { useShopComparison } from '~/src/hooks/use-shop-comparison';

const ShopComparisonScreen: React.FC = () => {
  const {
    carts,
    currentCartIndex,
    flippedItems,
    selectedCart,
    currentShop,
    areMoreCartsAvailable,
    isCurrentCheapest,
    isCurrentMostExpensive,
    savingsVsCheapest,
    savingsVsMostExpensive,
    isLoading,
    nextShop,
    prevShop,
    goToShop,
    handleFlipItem,
    handleSaveCart,
    handleDiscardCart,
  } = useShopComparison();

  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
    'right',
  );

  const handleNextShop = () => {
    setSlideDirection('right');
    nextShop();
  };

  const handlePrevShop = () => {
    setSlideDirection('left');
    prevShop();
  };

  const handleGoToShop = (index: number) => {
    setSlideDirection(index > currentCartIndex ? 'right' : 'left');
    goToShop(index);
  };

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      runOnJS(handleNextShop)();
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(handlePrevShop)();
    });

  const composedGestures = Gesture.Simultaneous(flingLeft, flingRight);

  if ((!carts || carts?.length === 0) && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted-foreground">
            Vami zvolené produkty sa nenachádzajú v žiadnom obchode
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={composedGestures}>
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View
            key={currentCartIndex}
            entering={
              slideDirection === 'right'
                ? SlideInRight.duration(200)
                : SlideInLeft.duration(200)
            }
          >
            <View className="bg-secondary px-4 py-6 border-b border-border">
              <ShopNavigationHeader
                currentShop={currentShop}
                carts={carts}
                onPrevShop={handlePrevShop}
                onNextShop={handleNextShop}
                areMoreCartsAvailable={areMoreCartsAvailable}
              />

              <ShopPagination
                carts={carts}
                currentCartIndex={currentCartIndex}
                onGoToShop={handleGoToShop}
                areMoreCartsAvailable={areMoreCartsAvailable}
              />

              <PriceSummaryCard
                selectedCart={selectedCart}
                isCurrentCheapest={isCurrentCheapest}
                isCurrentMostExpensive={isCurrentMostExpensive}
                areMoreCartsAvailable={areMoreCartsAvailable}
                savingsVsCheapest={savingsVsCheapest}
                currentCartIndex={currentCartIndex}
                totalCarts={carts?.length || 0}
                allCarts={carts ?? undefined}
              />
            </View>

            <View className="px-4 pb-6">
              <ProductsList
                selectedCart={selectedCart}
                flippedItems={flippedItems}
                onFlipItem={handleFlipItem}
              />
            </View>
          </Animated.View>
        </ScrollView>

        <ActionButtons
          onSaveCart={handleSaveCart}
          onDiscardCart={handleDiscardCart}
          savingsVsMostExpensive={savingsVsMostExpensive}
        />
      </SafeAreaView>
    </GestureDetector>
  );
};

export default ShopComparisonScreen;
