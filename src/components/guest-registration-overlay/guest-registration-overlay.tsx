import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Pressable, Text, View } from 'react-native';
import { useColorScheme } from '~/src/lib/useColorScheme';

interface GuestRegistrationOverlayProps {
  title?: string;
  description?: string;
  dismissable?: boolean;
  onDismiss?: () => void;
}

export const GuestRegistrationOverlay = ({
  title,
  description,
  dismissable = false,
  onDismiss,
}: GuestRegistrationOverlayProps) => {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const resolvedTitle = title ?? t('auth.overlay_title');
  const resolvedDescription = description ?? t('auth.overlay_description');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const gradientColors = isDarkColorScheme
    ? [
        'transparent',
        'rgba(24, 24, 24, 0.7)',
        'rgba(24, 24, 24, 0.95)',
        'rgba(24, 24, 24, 1)',
      ]
    : [
        'transparent',
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.95)',
        'rgba(255, 255, 255, 1)',
      ];

  const handleRegister = () => {
    router.push('/(app)/(auth)/sign-up');
  };

  const handleSignIn = () => {
    router.push('/(app)/(auth)/sign-in');
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 z-50"
      pointerEvents="box-none"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        locations={[0, 0.2, 0.5, 1]}
        style={{ paddingTop: 180, paddingBottom: 40 }}
      >
        <View className="items-center px-6 bg-background/90 mx-4 rounded-2xl py-6 relative">
          {dismissable && (
            <Pressable
              onPress={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 items-center justify-center rounded-full bg-muted active:opacity-60"
            >
              <Ionicons
                name="close"
                size={20}
                color={isDarkColorScheme ? '#A3A3A3' : '#737373'}
              />
            </Pressable>
          )}

          <Text className="text-2xl font-expose-bold text-foreground text-center mb-2">
            {resolvedTitle}
          </Text>
          <Text className="text-base font-sans text-muted-foreground text-center mb-6 px-4">
            {resolvedDescription}
          </Text>

          <Pressable
            onPress={handleRegister}
            className="bg-primary w-full py-4 rounded-xl mb-3 active:opacity-80"
          >
            <Text className="text-primary-foreground text-center font-expose-medium text-lg">
              {t('auth.register_free')}
            </Text>
          </Pressable>

          <Pressable onPress={handleSignIn} className="py-2 active:opacity-60">
            <Text className="text-muted-foreground font-sans text-center">
              {t('auth.have_account')}{' '}
              <Text className="text-terciary font-expose-medium">{t('auth.sign_in')}</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
