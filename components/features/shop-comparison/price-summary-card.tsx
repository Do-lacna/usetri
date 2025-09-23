import { Award, TrendingUp, TrendingDown, Info } from "lucide-react-native";
import type React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { CartComparisonDto } from "~/network/model";

interface PriceSummaryCardProps {
  selectedCart?: CartComparisonDto;
  isCurrentCheapest: boolean;
  isCurrentMostExpensive: boolean;
  areMoreCartsAvailable: boolean;
  savingsVsCheapest: number;
  savingsVsMostExpensive: number;
  currentCartIndex?: number;
  totalCarts?: number;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedCart,
  isCurrentCheapest,
  isCurrentMostExpensive,
  areMoreCartsAvailable,
  savingsVsCheapest,
  savingsVsMostExpensive,
  currentCartIndex = 0,
  totalCarts = 1,
}) => {
  const { t } = useTranslation("common");

  // Calculate percentage savings for better context
  const percentageSavings = savingsVsMostExpensive > 0 && selectedCart?.total_price
    ? ((savingsVsMostExpensive / (selectedCart.total_price + savingsVsMostExpensive)) * 100)
    : 0;

  const percentageExtra = savingsVsCheapest > 0 && selectedCart?.total_price
    ? ((savingsVsCheapest / selectedCart.total_price) * 100)
    : 0;

  const rankPosition = currentCartIndex + 1;

  return (
    <View className="bg-card rounded-xl p-4 border border-border">
      {/* Status and Savings Section */}
      <View className="mb-3">
        {isCurrentCheapest && (
          <View className="bg-green-50 px-3 py-2 rounded-lg mb-2">
            <View className="flex-row items-center">
              <Award size={18} color="#059669" />
              <Text className="text-lg font-semibold text-green-700 ml-2">
                {t("best_price")}
              </Text>
            </View>
            <Text className="text-sm text-green-600 mt-1">
              {t("cheapest_of_stores", { count: totalCarts })}
            </Text>
          </View>
        )}

        {isCurrentMostExpensive && areMoreCartsAvailable && (
          <View className="bg-red-50 px-3 py-2 rounded-lg mb-2">
            <View className="flex-row items-center">
              <TrendingUp size={18} color="#DC2626" />
              <Text className="text-lg font-semibold text-red-600 ml-2">
                {t("most_expensive")}
              </Text>
            </View>
            <Text className="text-sm text-red-600 mt-1">
              {t("more_than_cheapest", {
                amount: savingsVsCheapest.toFixed(2),
                percentage: percentageExtra.toFixed(1)
              })}
            </Text>
          </View>
        )}

        {!isCurrentCheapest && !isCurrentMostExpensive && (
          <View>
            {/* Show savings vs most expensive */}
            {savingsVsMostExpensive > 0 && (
              <View className="bg-green-50 px-3 py-2 rounded-lg mb-2">
                <View className="flex-row items-center">
                  <TrendingDown size={16} color="#059669" />
                  <Text className="text-md font-semibold text-green-700 ml-2">
                    {t("you_save", {
                      amount: savingsVsMostExpensive.toFixed(2),
                      percentage: percentageSavings.toFixed(1)
                    })}
                  </Text>
                </View>
                <Text className="text-sm text-green-600 mt-1">
                  {t("compared_to_most_expensive")}
                </Text>
              </View>
            )}

            {/* Show extra cost vs cheapest */}
            {savingsVsCheapest > 0 && (
              <View className="bg-orange-50 px-3 py-2 rounded-lg mb-2">
                <View className="flex-row items-center">
                  <Info size={16} color="#EA580C" />
                  <Text className="text-md font-semibold text-orange-700 ml-2">
                    {t("extra_cost", {
                      amount: savingsVsCheapest.toFixed(2),
                      percentage: percentageExtra.toFixed(1)
                    })}
                  </Text>
                </View>
                <Text className="text-sm text-orange-600 mt-1">
                  {t("compared_to_cheapest")}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Price Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground mb-1">{t("total_sum")}</Text>
          <Text className="text-3xl font-bold text-foreground">
            {selectedCart?.total_price?.toFixed(2)} €
          </Text>
        </View>

        {/* Quick comparison indicator */}
        {totalCarts > 1 && (
          <View className="items-center ml-4">
            <Text className="text-xs text-muted-foreground mb-1">{t("position")}</Text>
            <View className="bg-secondary rounded-full px-3 py-1">
              <Text className="text-sm font-semibold text-foreground">
                {rankPosition}/{totalCarts}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};