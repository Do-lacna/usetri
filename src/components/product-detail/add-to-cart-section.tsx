import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Button } from '~/src/components/ui/button';
import { ShoppingCart } from '~/src/lib/icons/Cart';
import { CircleCheck } from '~/src/lib/icons/CircleCheck';
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
  const { t } = useTranslation();
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
      return t('product_detail.added');
    }
    if (actionType === 'updated') {
      return t('product_detail.updated');
    }
    if (actionType === 'removed') {
      return t('product_detail.removed');
    }
    if (cartQuantity === 0) {
      return currentProductInCartQuantity > 0
        ? t('product_detail.remove_from_cart')
        : t('product_detail.select_quantity');
    }
    return currentProductInCartQuantity > 0
      ? t('product_detail.update_in_cart')
      : t('product_detail.add_to_shopping_list');
  };

  return (
    <View className="bg-card border-t border-border px-4 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-sm font-expose text-muted-foreground">
            {t('product_detail.price_in_shop', { shopName: selectedShopName })}
          </Text>
          <Text className="text-2xl font-expose-bold text-foreground">
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
              ? 'bg-success'
              : cartQuantity === 0
                ? 'bg-destructive'
                : 'bg-primary'
          }`}
        >
          <Animated.View style={animatedIconStyle}>
            {actionType ? (
              <CircleCheck size={20} className="mr-2 text-primary-foreground" />
            ) : (
              <ShoppingCart
                size={20}
                className="mr-2 text-primary-foreground"
              />
            )}
          </Animated.View>
          <Text className="font-expose-bold text-primary-foreground">
            {getButtonText()}
          </Text>
        </Button>
      </Animated.View>
    </View>
  );
};
