import EmptyCartSVG from '~/assets/images/other/empty-cart.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';
import { COLORS } from '~/src/lib/constants';
import { useColorScheme } from '~/src/lib/useColorScheme';
import React from "react";

interface GuestScreenProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showCartImage?: boolean;
  showProfileImage?: boolean;
}

export const GuestScreen = ({
  title = 'Prihláste sa pre prístup',
  description = 'Táto funkcia je dostupná len pre prihlásených používateľov. Zaregistrujte sa alebo sa prihláste pre plný prístup ku všetkým funkciám.',
  icon,
  showCartImage = false,
  showProfileImage = false,
}: GuestScreenProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const CartIcon = EmptyCartSVG as unknown as React.FC<SvgProps>;

  const handleRegister = () => {
    router.push('/(app)/(auth)/sign-up');
  };

  const handleSignIn = () => {
    router.push('/(app)/(auth)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LinearGradient
        colors={
          isDarkColorScheme
            ? [COLORS.i1, COLORS.i2, COLORS.i1]
            : [COLORS.white, COLORS.bgDefault, COLORS.white]
        }
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}
      >
        <View className="w-full max-w-sm items-center">
          {showCartImage && (
            <View className="mb-10 opacity-80">
              <CartIcon width={180} height={140} />
            </View>
          )}

          {showProfileImage && (
            <View className="mb-10">
              <Image
                source={require('~/assets/images/other/profile_placeholder.png')}
                style={{ width: 180, height: 140 }}
                resizeMode="contain"
              />
            </View>
          )}

          {icon && !showCartImage && !showProfileImage && (
            <View className="mb-8">{icon}</View>
          )}

          <Text className="text-2xl font-expose-bold text-foreground text-center mb-4">
            {title}
          </Text>

          <Text className="text-base font-expose text-muted-foreground text-center mb-10 leading-6">
            {description}
          </Text>

          <Pressable
            onPress={handleRegister}
            className="bg-primary w-full py-4 rounded-xl mb-4 active:opacity-80"
          >
            <Text className="text-primary-foreground text-center font-expose-bold text-lg">
              Zaregistrovať sa zadarmo
            </Text>
          </Pressable>

          <Pressable onPress={handleSignIn} className="py-3 active:opacity-60">
            <Text className="text-muted-foreground font-expose text-center">
              Už máte účet?{' '}
              <Text className="text-terciary font-expose-bold">Prihlásiť sa</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
