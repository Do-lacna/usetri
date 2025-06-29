import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity, View, ViewStyle } from "react-native";

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  style?: ViewStyle;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  isFlipped,
  onFlip,
  style = {},
}) => {
  const flipAnimation = useRef(new Animated.Value(180)).current; // Start from back (180deg)
  const [hasInitialFlipped, setHasInitialFlipped] = useState(false);

  // Initial flip animation on mount
  React.useEffect(() => {
    if (!hasInitialFlipped) {
      // Start from back, flip to front with a delay for staggered effect
      const delay = Math.random() * 500; // Random delay between 0-500ms for staggered effect

      setTimeout(() => {
        Animated.timing(flipAnimation, {
          toValue: 0, // Flip to front
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setHasInitialFlipped(true);
        });
      }, delay);
    }
  }, [hasInitialFlipped]);

  // Handle user interactions after initial flip
  React.useEffect(() => {
    if (hasInitialFlipped) {
      Animated.timing(flipAnimation, {
        toValue: isFlipped ? 180 : 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isFlipped, hasInitialFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity
      onPress={hasInitialFlipped ? onFlip : undefined}
      style={style}
      disabled={!hasInitialFlipped} // Disable touch during initial animation
    >
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            frontAnimatedStyle,
            {
              backfaceVisibility: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            },
          ]}
        >
          {frontContent}
        </Animated.View>

        <Animated.View
          style={[
            backAnimatedStyle,
            {
              backfaceVisibility: "hidden",
            },
          ]}
        >
          {backContent}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default FlippableCard;
