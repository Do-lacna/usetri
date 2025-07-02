import { Award, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { CartComparisonDto } from '~/network/model';

interface PriceSummaryCardProps {
  selectedCart?: CartComparisonDto;
  isCurrentCheapest: boolean;
  isCurrentMostExpensive: boolean;
  areMoreCartsAvailable: boolean;
  savingsVsCheapest: number;
  savingsVsMostExpensive: number;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedCart,
  isCurrentCheapest,
  isCurrentMostExpensive,
  areMoreCartsAvailable,
  savingsVsCheapest,
  savingsVsMostExpensive,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-gray-600 mb-1">Celková suma</Text>
          <Text className="text-3xl font-bold text-gray-900">
            {selectedCart?.total_price?.toFixed(2)} €
          </Text>
        </View>
        <View className="items-end">
          {isCurrentCheapest && (
            <View className="flex-row items-center mb-1">
              <Award size={16} color="#059669" />
              <Text className="text-sm font-medium text-green-600 ml-1">
                Najlepšia cena
              </Text>
            </View>
          )}
          {isCurrentMostExpensive && areMoreCartsAvailable && (
            <View className="flex-row items-center mb-1">
              <TrendingUp size={16} color="#DC2626" />
              <Text className="text-sm font-medium text-red-600 ml-2">
                Najdrahšie
              </Text>
            </View>
          )}
          {!isCurrentCheapest && (
            <Text className="text-md text-red-600 font-bold">
              + {savingsVsCheapest.toFixed(2)} €
            </Text>
          )}
          {!isCurrentMostExpensive && savingsVsMostExpensive > 0 && (
            <Text className="text-md text-green-600 font-bold">
              - {savingsVsMostExpensive.toFixed(2)} €
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};