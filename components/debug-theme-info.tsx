import React from "react";
import { Text, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

export function DebugThemeInfo() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <View className="p-4 border border-red-500 mb-4">
      <Text className="text-foreground">Color Scheme: {colorScheme}</Text>
      <Text className="text-foreground">
        Is Dark: {isDarkColorScheme ? "true" : "false"}
      </Text>
      <Text className="text-foreground">This text should change color</Text>
      <View className="w-full h-10 bg-background border border-border mt-2">
        <Text className="text-center text-foreground">Background test</Text>
      </View>
    </View>
  );
}
