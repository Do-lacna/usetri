import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View, type ViewStyle } from 'react-native';

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
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Handle flip animation on user interaction
  React.useEffect(() => {
    if (!disableFlipping) {
      Animated.timing(flipAnimation, {
        toValue: isFlipped ? 180 : 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isFlipped, disableFlipping]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
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
      <View style={style} className="py-1">
        {frontContent}
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onFlip} style={style} className="py-1">
      <View style={{ position: 'relative', minHeight: 'auto' }}>
        <Animated.View
          style={[
            frontAnimatedStyle,
            {
              backfaceVisibility: 'hidden',
              position: isFlipped ? 'absolute' : 'relative',
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
              backfaceVisibility: 'hidden',
              position: isFlipped ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
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
