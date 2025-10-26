import type React from 'react';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

interface CounterProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 1,
  onCountChange,
  className,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
    if (onCountChange) {
      onCountChange(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
      if (onCountChange) {
        onCountChange(count - 1);
      }
    }
  };

  return (
    <View className={cn('flex-row items-center', className)}>
      <TouchableOpacity
        className="rounded-full w-10 h-10 justify-center items-center border-2 border-gray-200 dark:border-gray-700"
        onPress={decrementCount}
      >
        <Text className="text-xl">-</Text>
      </TouchableOpacity>

      <Text className="mx-4 text-xl font-semibold">{count}</Text>

      <TouchableOpacity
        className="rounded-full w-10 h-10 justify-center items-center border-2 border-gray-200 dark:border-gray-700"
        onPress={incrementCount}
      >
        <Text className="text-xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Counter;
