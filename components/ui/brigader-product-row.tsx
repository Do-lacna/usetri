import React from "react";
import { Text, View } from "react-native";
import { Camera } from "~/lib/icons/Camera";
import { Check } from "~/lib/icons/Check";
import IconButton from "../icon-button";

interface IShoppingListItemProps {
  label: string | null;
  description?: string;
}

const BrigaderProductRow = ({ label, description }: IShoppingListItemProps) => {
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
      <View className="flex-row items-center gap-4 flex-shrink-0">
        <IconButton
          onPress={() => {
            console.log("skenuj");
          }}
          className="bg-divider rounded-full w-10 h-10 flex items-center justify-center self-center"
        >
          <Camera size={24} />
        </IconButton>
        <IconButton
          onPress={() => {
            console.log("skenuj");
          }}
          className="bg-divider rounded-full w-10 h-10 flex items-center justify-center self-center"
        >
          <Check size={24} />
        </IconButton>
      </View>
    </View>
  );
};

export default BrigaderProductRow;
