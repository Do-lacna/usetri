import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Minus } from '~/lib/icons/Minus';
import { Plus } from '~/lib/icons/Plus';

interface QuantityCounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityCounter: React.FC<QuantityCounterProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View className="flex-row items-center bg-muted rounded-lg">
      <TouchableOpacity
        onPress={onDecrement}
        disabled={quantity === 0}
        className={`w-12 h-12 items-center justify-center rounded-l-lg ${
          quantity === 0 ? 'opacity-50' : ''
        }`}
      >
        <Minus className="text-foreground" size={20} />
      </TouchableOpacity>

      <View className="w-16 h-12 items-center justify-center bg-background">
        <Text className="text-lg font-semibold text-foreground">
          {quantity}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onIncrement}
        className="w-12 h-12 items-center justify-center rounded-r-lg"
      >
        <Plus className="text-foreground" size={20} />
      </TouchableOpacity>
    </View>
  );
};
