import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
        <Ionicons name="remove" size={20} color="hsl(240, 3.8%, 46.1%)" />
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
        <Ionicons name="add" size={20} color="hsl(240, 3.8%, 46.1%)" />
      </TouchableOpacity>
    </View>
  );
};