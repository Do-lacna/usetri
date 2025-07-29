import { Link } from "expo-router";
import { ArrowDown } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useGetHybridCart } from "../../network/hybrid-cart/hybrid-cart";
import IconButton from "../icon-button";

export type PriceSummaryProps = {
  onPress?: () => void;
};

const PriceSummary = ({ onPress }: PriceSummaryProps) => {
  const screenWidth = Dimensions.get("window").width;
  const {
    data: { cart: { total_price = 0 } = {} } = {},
    isLoading: isCartLoading,
  } = ({} = useGetHybridCart());

  return (
    <Link
      asChild
      href={"/main/price-comparison-modal/price-comparison-modal-screen"}
    >
      <Pressable
        style={{ width: screenWidth }}
        className="bg-primary absolute bottom-0 left-0 right-0 p-2 rounded-t-xl h-16"
        onPress={onPress}
      >
        <View className="p-2 shadow-sm shadow-foreground/10 flex flex-row justify-between items-center">
          <View>
            <Text className="text-foreground font-bold text-xl">
              Celková suma
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-foreground font-bold text-xl">
              {total_price?.toFixed(2)} €
            </Text>
            <IconButton className="bg-secondary rounded-full p-2" onPress={onPress}>
              <ArrowDown size={20} />
            </IconButton>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default PriceSummary;
