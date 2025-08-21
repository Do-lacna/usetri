import type React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { ActionButtons } from "~/components/shop-comparison/action-buttons";
import { PriceSummaryCard } from "~/components/shop-comparison/price-summary-card";
import { ProductsList } from "~/components/shop-comparison/products-list";
import { ShopNavigationHeader } from "~/components/shop-comparison/shop-navigation-header";
import { ShopPagination } from "~/components/shop-comparison/shop-pagination";
import { Text } from "~/components/ui/text";
import { useShopComparison } from "~/hooks/use-shop-comparison";

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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-secondary px-4 py-6 border-b border-border">
          <ShopNavigationHeader
            currentShop={currentShop}
            carts={carts}
            onPrevShop={prevShop}
            onNextShop={nextShop}
            areMoreCartsAvailable={areMoreCartsAvailable}
          />

          <ShopPagination
            carts={carts}
            currentCartIndex={currentCartIndex}
            onGoToShop={goToShop}
            areMoreCartsAvailable={areMoreCartsAvailable}
          />

          <PriceSummaryCard
            selectedCart={selectedCart}
            isCurrentCheapest={isCurrentCheapest}
            isCurrentMostExpensive={isCurrentMostExpensive}
            areMoreCartsAvailable={areMoreCartsAvailable}
            savingsVsCheapest={savingsVsCheapest}
            savingsVsMostExpensive={savingsVsMostExpensive}
          />
        </View>

        <View className="px-4 pb-6">
          <ProductsList
            selectedCart={selectedCart}
            flippedItems={flippedItems}
            onFlipItem={handleFlipItem}
          />
        </View>
      </ScrollView>

      <ActionButtons
        onSaveCart={handleSaveCart}
        onDiscardCart={handleDiscardCart}
        savingsVsMostExpensive={savingsVsMostExpensive}
      />
    </SafeAreaView>
  );
};

export default ShopComparisonScreen;
