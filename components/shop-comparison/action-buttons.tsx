import React from "react";
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
    <View className="bg-white px-4 py-3 border-t border-gray-200">
      <View className="flex-row justify-center items-center gap-4">
        <Button
          variant="outline"
          onPress={onDiscardCart}
          className="w-[30%] border-2 border-gray-600"
        >
          <Text className="font-bold text-gray-700">Zahodiť</Text>
        </Button>
        <Button onPress={onSaveCart} className="w-[60%] h-44">
          <Text className="font-bold text-white">{`Ušetri ${
            savingsVsMostExpensive.toFixed(2) ?? 0
          } €`}</Text>
          {/* <Text className="text-white text-xs">
            (Nakupenim v tomto obchode)
          </Text> */}
        </Button>
      </View>
    </View>
  );
};
