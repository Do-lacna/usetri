import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PRIMARY_HEX } from "../../lib/constants";

interface AnimatedCartBadgeProps {
  count: number;
}

export const AnimatedCartBadge: React.FC<AnimatedCartBadgeProps> = ({
  count,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(count > 0 ? 1 : 0);
  const [displayCount, setDisplayCount] = React.useState(count);

  useEffect(() => {
    if (count !== displayCount) {
      // Update display count
      setDisplayCount(count);

      if (count > 0) {
        // Show badge with bounce animation
        opacity.value = withTiming(1, { duration: 200 });
        scale.value = withSequence(
          withSpring(1.3, { damping: 8, stiffness: 150 }),
          withSpring(1, { damping: 8, stiffness: 150 })
        );
      } else {
        // Hide badge with scale down
        scale.value = withTiming(0.8, { duration: 150 }, () => {
          opacity.value = withTiming(0, { duration: 100 });
        });
      }
    }
  }, [count, displayCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (count === 0) return null;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: PRIMARY_HEX,
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: -8,
          right: -10,
          paddingHorizontal: count > 9 ? 6 : 0,
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
        {count > 99 ? "99+" : count}
      </Text>
    </Animated.View>
  );
};
