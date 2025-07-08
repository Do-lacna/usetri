import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity, View, ViewStyle } from "react-native";

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  style?: ViewStyle;
  disableFlipping?: boolean; // New prop to disable flipping
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  isFlipped,
  onFlip,
  style = {},
  disableFlipping = false, // Default to false to maintain existing behavior
}) => {
  const flipAnimation = useRef(new Animated.Value(disableFlipping ? 0 : 180)).current; // Start from front if flipping is disabled
  const [hasInitialFlipped, setHasInitialFlipped] = useState(disableFlipping); // Skip initial flip if disabled

  // Initial flip animation on mount (only if flipping is enabled)
  React.useEffect(() => {
    if (!disableFlipping && !hasInitialFlipped) {
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
  }, [hasInitialFlipped, disableFlipping]);

  // Handle user interactions after initial flip (only if flipping is enabled)
  React.useEffect(() => {
    if (!disableFlipping && hasInitialFlipped) {
      Animated.timing(flipAnimation, {
        toValue: isFlipped ? 180 : 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isFlipped, hasInitialFlipped, disableFlipping]);

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

  // If flipping is disabled, render a simple view with just front content
  if (disableFlipping) {
    return (
      <View style={style} className="h-18 py-1">
        {frontContent}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={hasInitialFlipped ? onFlip : undefined}
      style={style}
      disabled={!hasInitialFlipped} // Disable touch during initial animation
      className="h-18 py-1"
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