import React from "react";
import { Image, View } from "react-native";
import { Text } from "../ui/text";

const EmptyShoppingListPlaceholderScreen = () => {
  return (
    <View className="w-full justify-center items-center absolute top-60 -z-10">
      <Image
        source={require("../../assets/images/empty-cart.png")}
        className="w-60 h-60 mb-1"
        resizeMode="contain"
      />
      <Text className="text-3xl w-3/4 text-center text-primary-background">
        Tvoj nákupný zoznam je prázdny.
      </Text>
    </View>
  );
};

export default EmptyShoppingListPlaceholderScreen;
