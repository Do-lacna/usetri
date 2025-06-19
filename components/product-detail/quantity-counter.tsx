import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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
    <View className="flex-row items-center bg-gray-100 rounded-lg">
      <TouchableOpacity
        onPress={onDecrement}
        disabled={quantity === 0}
        className={`w-12 h-12 items-center justify-center rounded-l-lg ${
          quantity === 0 ? 'opacity-50' : ''
        }`}
      >
        <Ionicons name="remove" size={20} color="#374151" />
      </TouchableOpacity>

      <View className="w-16 h-12 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-900">
          {quantity}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onIncrement}
        className="w-12 h-12 items-center justify-center rounded-r-lg"
      >
        <Ionicons name="add" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};