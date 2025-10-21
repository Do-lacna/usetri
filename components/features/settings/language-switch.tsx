import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface LanguageSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitch({
  className,
  showLabel = true,
}: LanguageSwitchProps) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const translateX = useSharedValue(isEnglish ? 28 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(isEnglish ? 28 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isEnglish, translateX]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    const newLanguage = isEnglish ? 'sk' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      {showLabel && (
        <View className="flex-row items-center flex-1">
          <Text className="text-base text-foreground">Jazyk</Text>
        </View>
      )}

      <Pressable
        onPress={handlePress}
        className={cn(
          'relative w-14 h-7 rounded-full border-2 justify-center',
          isEnglish ? 'bg-primary border-primary' : 'bg-muted border-border',
        )}
      >
        {/* Track labels */}
        <View className="absolute inset-0 flex-row items-center justify-between px-1.5">
          <Text
            className={cn(
              'text-xs font-semibold',
              !isEnglish ? 'text-primary' : 'text-primary-foreground/40',
            )}
          >
            SK
          </Text>
          <Text
            className={cn(
              'text-xs font-semibold',
              isEnglish
                ? 'text-primary-foreground'
                : 'text-muted-foreground/40',
            )}
          >
            EN
          </Text>
        </View>

        {/* Animated thumb */}
        <Animated.View
          style={[animatedThumbStyle]}
          className={cn(
            'absolute w-5 h-5 rounded-full shadow-sm',
            'bg-background',
          )}
        />
      </Pressable>
    </View>
  );
}
