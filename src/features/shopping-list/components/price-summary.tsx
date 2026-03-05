import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ArrowDown } from '~/src/lib/icons/ArrowDown';
import { useGetCart } from '~/src/network/cart/cart';

export type PriceSummaryProps = {
  onPress?: () => void;
};

const COMPARISON_ROUTE =
  '/main/price-comparison-modal/price-comparison-modal-screen';

const PriceSummary = ({ onPress }: PriceSummaryProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    data: {
      cart: { total_price = 0 } = {},
    } = {},
    isLoading: isCartLoading,
  } = useGetCart();

  const animatedPrice = useSharedValue(0);
  const scale = useSharedValue(1);
  const barProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  const [displayPrice, setDisplayPrice] = React.useState(0);
  const lastCents = useSharedValue<number | null>(null);

  useEffect(() => {
    barProgress.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const navigate = useCallback(() => {
    onPress?.();
    router.navigate(COMPARISON_ROUTE);
  }, [onPress]);

  useEffect(() => {
    if (total_price !== undefined && animatedPrice.value === 0) {
      animatedPrice.value = total_price;
      setDisplayPrice(total_price);
    }
  }, [total_price]);

  const animateToPrice = (newPrice: number) => {
    const startPrice = animatedPrice.value;
    const difference = Math.abs(newPrice - startPrice);
    const duration = Math.min(difference * 30, 800);

    animatedPrice.value = withTiming(newPrice, {
      duration: duration > 200 ? duration : 300,
    });

    scale.value = withTiming(1.06, { duration: 90 }, () => {
      scale.value = withTiming(1, { duration: 160 });
    });
  };

  useEffect(() => {
    if (
      total_price !== undefined &&
      total_price !== animatedPrice.value &&
      animatedPrice.value !== 0
    ) {
      animateToPrice(total_price);
    }
  }, [total_price]);

  useDerivedValue(() => {
    const cents = Math.round(animatedPrice.value * 100);
    if (lastCents.value !== cents) {
      lastCents.value = cents;
      runOnJS(setDisplayPrice)(cents / 100);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const barAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: barProgress.value,
      transform: [
        { translateY: (1 - barProgress.value) * 14 },
        { scale: pressScale.value },
      ],
    };
  });

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        backgroundColor: 'transparent',
      }}
    >
      <Animated.View style={barAnimatedStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('price_summary.show_comparison')}
          onPress={navigate}
          onPressIn={() => {
            pressScale.value = withSpring(0.98, {
              damping: 16,
              stiffness: 220,
              mass: 0.7,
            });
          }}
          onPressOut={() => {
            pressScale.value = withSpring(1, {
              damping: 16,
              stiffness: 220,
              mass: 0.7,
            });
          }}
          className="mx-2 mb-2 rounded-2xl bg-primary px-4 py-3 border border-foreground/10"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-foreground font-bold text-base">
                {t('price_summary.total_sum')}
              </Text>
              <Text className="text-foreground/80 text-xs">
                {t('price_summary.show_comparison')}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Animated.View style={animatedStyle}>
                <Text className="text-foreground font-bold text-xl tabular-nums">
                  {isCartLoading ? '—.—' : displayPrice.toFixed(2)} €
                </Text>
              </Animated.View>
              {/* ArrowDown rotated to point right */}
              <View style={{ transform: [{ rotate: '-90deg' }] }}>
                <ArrowDown size={18} className="text-foreground/80" />
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default PriceSummary;
