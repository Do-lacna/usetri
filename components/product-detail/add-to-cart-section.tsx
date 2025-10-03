import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { QuantityCounter } from './quantity-counter';

interface AddToCartSectionProps {
  selectedShopName?: string;
  totalPrice: number;
  cartQuantity: number;
  currentProductInCartQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  selectedShopName,
  totalPrice,
  cartQuantity,
  currentProductInCartQuantity,
  onIncrement,
  onDecrement,
  onAddToCart,
}) => {
  const getButtonText = () => {
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

      <Button
        onPress={onAddToCart}
        className={`py-4 rounded-lg items-center justify-center flex-row ${
          cartQuantity === 0 ? 'bg-red-400' : 'bg-primary'
        }`}
      >
        <Ionicons name="cart" size={20} className="mr-2" />
        <Text className="font-semibold">{getButtonText()}</Text>
      </Button>
    </View>
  );
};
