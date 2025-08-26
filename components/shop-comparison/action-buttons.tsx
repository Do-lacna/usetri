import type React from "react";
import { Text, View } from "react-native";
import { Button } from "~/components/ui/button";

interface ActionButtonsProps {
  onSaveCart: () => void;
  onDiscardCart: () => void;
  savingsVsMostExpensive: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSaveCart,
  onDiscardCart,
  savingsVsMostExpensive,
}) => {
  return (
    <View className="bg-card px-4 py-3 border-t border-border">
      <View className="flex-row justify-center items-center gap-4">
        <Button variant="outline" onPress={onDiscardCart} className="w-[30%]">
          <Text className="font-bold text-foreground">Zahodiť</Text>
        </Button>
        <Button onPress={onSaveCart} className="w-[60%] h-44">
          <Text className="font-bold text-primary-foreground">{`Ušetri ${
            Math.abs(savingsVsMostExpensive).toFixed(2) ?? 0
          } €`}</Text>
        </Button>
      </View>
    </View>
  );
};
