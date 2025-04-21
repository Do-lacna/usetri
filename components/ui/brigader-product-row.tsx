import React from "react";
import { Text, View } from "react-native";
import { Camera } from "~/lib/icons/Camera";
import { Check } from "~/lib/icons/Check";
import IconButton from "../icon-button";

interface IShoppingListItemProps {
  label: string | null;
  description?: string;
  price?: number;
}

const BrigaderProductRow = ({
  label,
  description,
  price = 0,
}: IShoppingListItemProps) => {
  return (
    <View className="w-full bg-white rounded-lg shadow-sm mb-2 relative flex-row items-center justify-between p-4">
      {/* Text content container with flex-1 to take available space and shrink if needed */}
      <View className="flex-1 mr-4">
        <Text
          className="text-base font-medium text-gray-800"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        {!!description && (
          <Text
            className="text-sm font-medium text-gray-600"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}
      </View>

      {/* Buttons container with flex-shrink-0 to prevent shrinking */}
      <View className="flex items-center gap-2">
        <Text className="font-bold">{price} €</Text>
        <View className="flex-row items-center gap-4 flex-shrink-0">
          <IconButton
            onPress={() => {
              console.log("skenuj");
            }}
            className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center"
          >
            <Camera size={20} />
          </IconButton>
          <IconButton
            onPress={() => {
              console.log("skenuj");
            }}
            className="bg-divider rounded-full w-8 h-8 flex items-center justify-center self-center"
          >
            <Check size={20} />
          </IconButton>
        </View>
      </View>
    </View>
  );
};

export default BrigaderProductRow;
