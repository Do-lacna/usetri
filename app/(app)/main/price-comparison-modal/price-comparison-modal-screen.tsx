import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, ImageBackground, View } from 'react-native';
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
  const { t } = useTranslation();
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
            {t('shop_comparison_screen.no_products_in_shops')}
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
            <ImageBackground
              source={require('~/assets/images/pattern.png')}
              className="px-4 py-6 border-b border-border"
              imageStyle={{ resizeMode: 'cover', opacity: 0.5 }}
            >
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
                savingsVsCheapest={savingsVsCheapest}
                currentCartIndex={currentCartIndex}
                totalCarts={carts?.length || 0}
                allCarts={carts ?? undefined}
              />
            </ImageBackground>

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
