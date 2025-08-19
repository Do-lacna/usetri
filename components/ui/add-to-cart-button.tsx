import type React from "react";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "./text";

interface AddToCartButtonProps {
  initialCount?: number;
  onConfirm: (count: number) => void;
  onCountChange?: (count: number) => void;
  onDismiss?: () => void;
  minCount?: number;
  maxCount?: number;
  disabled?: boolean;
  confirmText?: string;
  showCounter?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  initialCount = 1,
  onConfirm,
  onCountChange,
  onDismiss,
  minCount = 1,
  maxCount = 99,
  disabled = false,
  confirmText = "Pridať do košíka",
  showCounter = true,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const increment = () => {
    if (count < maxCount && !disabled) {
      const newCount = count + 1;
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };

  const decrement = () => {
    if (count > minCount && !disabled) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };

  const handleConfirm = () => {
    if (!disabled) {
      onConfirm(count);
    }
  };

  if (!showCounter) {
    return (
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={disabled}
        className={`bg-primary rounded-xl py-4 px-6 ${disabled ? "opacity-50" : ""}`}
        activeOpacity={0.8}
      >
        <Text className="text-primary-foreground font-semibold text-center text-lg">
          {confirmText}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`flex-row items-center bg-primary rounded-xl overflow-hidden ${disabled ? "opacity-50" : ""}`}>
      {/* Decrement Button */}
      <TouchableOpacity
        onPress={decrement}
        disabled={count <= minCount || disabled}
        className={`w-[40px] rounded-lg border-r-2 border-gray-400 py-4 px-4 ${count <= minCount || disabled ? "opacity-50" : ""}`}
        activeOpacity={0.7}
      >
        <Text className="text-primary-foreground font-bold text-lg">−</Text>
      </TouchableOpacity>



      {/* Main Confirm Button */}
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={disabled}
        className="flex-1 py-4 px-4"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center justify-center space-x-2">
          <Text className="text-primary-foreground font-semibold text-base">
            {confirmText}
          </Text>
          <View className="bg-primary-foreground/20 rounded-full px-2 py-1 min-w-[24px]">
            <Text className="text-primary-foreground font-bold text-sm text-center">
              {count}
            </Text>
          </View>
        </View>
      </TouchableOpacity>


      {/* Increment Button */}
      <TouchableOpacity
        onPress={increment}
        disabled={count >= maxCount || disabled}
        className={`w-[40px] rounded-lg border-l-2 border-gray-400 py-4 px-4 ${count >= maxCount || disabled ? "opacity-50" : ""}`}
        activeOpacity={0.7}
      >
        <Text className="text-primary-foreground font-bold text-lg">+</Text>
      </TouchableOpacity>
    </View>
  );
};
