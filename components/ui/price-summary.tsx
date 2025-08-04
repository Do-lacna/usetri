import { Link } from "expo-router";
import { ArrowDown } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
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

  // Animated values
  const animatedPrice = useSharedValue(0);
  const scale = useSharedValue(1);
  const [displayPrice, setDisplayPrice] = React.useState(0);

  // Initialize the animated price on first load
  useEffect(() => {
    if (total_price !== undefined && animatedPrice.value === 0) {
      animatedPrice.value = total_price;
      setDisplayPrice(total_price);
    }
  }, [total_price]);

  // Animation to update the displayed price smoothly
  const animateToPrice = (newPrice: number) => {
    const startPrice = animatedPrice.value;
    const difference = Math.abs(newPrice - startPrice);
    const duration = Math.min(difference * 30, 800); // Max 800ms
    
    animatedPrice.value = withTiming(newPrice, { 
      duration: duration > 200 ? duration : 300 
    });
    
    // Scale animation for visual feedback
    scale.value = withTiming(1.15, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 200 });
    });
  };

  // Update animated price when total_price changes
  useEffect(() => {
    if (total_price !== undefined && total_price !== animatedPrice.value && animatedPrice.value !== 0) {
      animateToPrice(total_price);
    }
  }, [total_price]);

  // Derive the display price from animated value for smooth counting
  useDerivedValue(() => {
    runOnJS(setDisplayPrice)(animatedPrice.value);
  });

  // Animated style for scale effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
            <Animated.View style={animatedStyle}>
              <Text className="text-foreground font-bold text-xl">
                {displayPrice.toFixed(2)} €
              </Text>
            </Animated.View>
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
