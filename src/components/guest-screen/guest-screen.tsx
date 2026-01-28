import EmptyCartSVG from 'assets/images/empty-cart.svg';
import ProfilePlaceholderSVG from 'assets/images/profile_placeholder.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SvgProps } from 'react-native-svg';
import { useSession } from '~/src/context/authentication-context';
import { useColorScheme } from '~/src/lib/useColorScheme';

interface GuestScreenProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showCartImage?: boolean;
  showProfileImage?: boolean;
  showLogoutButton?: boolean;
}

export const GuestScreen = ({
  title = 'Prihláste sa pre prístup',
  description = 'Táto funkcia je dostupná len pre prihlásených používateľov. Zaregistrujte sa alebo sa prihláste pre plný prístup ku všetkým funkciám.',
  icon,
  showCartImage = false,
  showProfileImage = false,
  showLogoutButton = false,
}: GuestScreenProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const { signOut } = useSession();
  const CartIcon = EmptyCartSVG as unknown as React.FC<SvgProps>;
  const ProfileIcon = ProfilePlaceholderSVG as unknown as React.FC<SvgProps>;

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
            ? ['#181818', '#1a1a1a', '#181818']
            : ['#ffffff', '#f8f8f8', '#ffffff']
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
              <ProfileIcon width={180} height={140} />
            </View>
          )}

          {icon && !showCartImage && !showProfileImage && (
            <View className="mb-8">{icon}</View>
          )}

          <Text className="text-2xl font-bold text-foreground text-center mb-4">
            {title}
          </Text>

          <Text className="text-base text-muted-foreground text-center mb-10 leading-6">
            {description}
          </Text>

          <Pressable
            onPress={handleRegister}
            className="bg-primary w-full py-4 rounded-xl mb-4 active:opacity-80"
          >
            <Text className="text-primary-foreground text-center font-semibold text-lg">
              Zaregistrovať sa zadarmo
            </Text>
          </Pressable>

          <Pressable onPress={handleSignIn} className="py-3 active:opacity-60">
            <Text className="text-muted-foreground text-center">
              Už máte účet?{' '}
              <Text className="text-terciary font-semibold">Prihlásiť sa</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
