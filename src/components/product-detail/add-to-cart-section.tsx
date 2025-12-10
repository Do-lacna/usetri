import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Button } from '~/src/components/ui/button';
import { QuantityCounter } from './quantity-counter';

interface AddToCartSectionProps {
  selectedShopName?: string;
  totalPrice: number;
  cartQuantity: number;
  currentProductInCartQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  actionType?: 'added' | 'updated' | 'removed' | null;
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  selectedShopName,
  totalPrice,
  cartQuantity,
  currentProductInCartQuantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  actionType = null,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    if (actionType) {
      // Scale animation: bounce effect
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
      // Icon rotation: spin effect
      iconRotation.value = withSpring(360, { damping: 10, stiffness: 100 });
    } else {
      iconRotation.value = withSpring(0, { damping: 10, stiffness: 100 });
    }
  }, [actionType]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const getButtonText = () => {
    if (actionType === 'added') {
      return 'Pridané ✓';
    }
    if (actionType === 'updated') {
      return 'Aktualizované ✓';
    }
    if (actionType === 'removed') {
      return 'Odobrané ✓';
    }
    if (cartQuantity === 0) {
      return currentProductInCartQuantity > 0
        ? 'Odobrať z košíka'
        : 'Zvoľte množstvo';
    }
    return currentProductInCartQuantity > 0
      ? 'Aktualizovať v košíku'
      : 'Pridať do nákupného zoznamu';
  };

  return (
    <View className="bg-card border-t border-border px-4 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-sm text-muted-foreground">
            Cena v {selectedShopName}
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {totalPrice.toFixed(2)} €
          </Text>
        </View>

        <QuantityCounter
          quantity={cartQuantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </View>

      <Animated.View style={animatedButtonStyle}>
        <Button
          onPress={onAddToCart}
          disabled={!!actionType}
          className={`py-4 rounded-lg items-center justify-center flex-row ${
            actionType
              ? 'bg-green-500'
              : cartQuantity === 0
                ? 'bg-red-400'
                : 'bg-primary'
          }`}
        >
          <Animated.View style={animatedIconStyle}>
            <Ionicons
              name={actionType ? 'checkmark-circle' : 'cart'}
              size={20}
              className="mr-2"
            />
          </Animated.View>
          <Text className="font-semibold">{getButtonText()}</Text>
        </Button>
      </Animated.View>
    </View>
  );
};
