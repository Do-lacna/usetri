import type React from "react";
import { View } from "react-native";
import { Button } from "../button";
import { Text } from "../text";

interface CartItemActionsProps {
  onDismiss: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
}

export const CartItemActions: React.FC<CartItemActionsProps> = ({
  onDismiss,
  onConfirm,
  isLoading = false,
  confirmText = "Pridať do zoznamu",
}) => {
  return (
    <View className="w-full flex-row gap-4 items-center justify-center mt-8">
      <Button
        onPress={onDismiss}
        variant="outline"
        className="w-1/3"
        disabled={isLoading}
      >
        <Text>Zrušiť</Text>
      </Button>
      <Button
        onPress={onConfirm}
        className="w-1/2"
        disabled={isLoading}
      >
        <Text>{confirmText}</Text>
      </Button>
    </View>
  );
};
