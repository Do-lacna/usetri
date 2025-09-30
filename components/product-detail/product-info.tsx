import type React from 'react';
import { Text, View } from 'react-native';

interface ProductInfoProps {
  name: string;
  brand: string;
  amount: number;
  unit: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  brand,
  amount,
  unit,
}) => {
  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-foreground mb-2">
        {name}
      </Text>
      <View className="flex-row items-center mb-2 justify-between">
        <Text className="text-lg text-muted-foreground mb-1">{brand}</Text>
        <Text className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
          {amount} {unit}
        </Text>
      </View>
    </View>
  );
};