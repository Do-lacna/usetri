import { Link } from "expo-router";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";

export type PriceSummaryProps = {
  price: number;
  onPress: () => void;
};

const PriceSummary = ({ price = 12.5, onPress }: PriceSummaryProps) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <Link asChild href={"/main/modal"}>
      <Pressable
        style={{ width: screenWidth }}
        className="bg-primary absolute bottom-0 left-0 right-0 p-2"
        onPress={onPress}
      >
        <View className="p-2 shadow-sm shadow-foreground/10 flex-row justify-between items-center">
          <Text className="text-foreground font-bold">Celková suma</Text>
          <Text className="text-foreground font-bold">
            {price.toFixed(2)} €
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default PriceSummary;
