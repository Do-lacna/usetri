import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

interface ThemeSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitch({ className, showLabel = true }: ThemeSwitchProps) {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const translateX = useSharedValue(isDarkColorScheme ? 28 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(isDarkColorScheme ? 28 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isDarkColorScheme, translateX]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    toggleColorScheme();
  };

  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      {showLabel && (
        <View className="flex-row items-center flex-1">
          <Text className="text-base text-foreground">Tmavý režim</Text>
        </View>
      )}

      <Pressable
        onPress={handlePress}
        className={cn(
          'relative w-14 h-7 rounded-full border-2 justify-center',
          isDarkColorScheme
            ? 'bg-primary border-primary'
            : 'bg-muted border-border',
        )}
      >
        {/* Track icons */}
        <View className="absolute inset-0 flex-row items-center justify-between px-1">
          <Sun
            size={14}
            className={cn(
              'transition-opacity',
              isDarkColorScheme ? 'text-primary-foreground/40' : 'text-primary',
            )}
          />
          <MoonStar
            size={14}
            className={cn(
              'transition-opacity',
              isDarkColorScheme
                ? 'text-primary-foreground'
                : 'text-muted-foreground/40',
            )}
          />
        </View>

        {/* Animated thumb */}
        <Animated.View
          style={[animatedThumbStyle]}
          className={cn(
            'absolute w-5 h-5 rounded-full shadow-sm',
            isDarkColorScheme ? 'bg-background' : 'bg-background',
          )}
        />
      </Pressable>
    </View>
  );
}
