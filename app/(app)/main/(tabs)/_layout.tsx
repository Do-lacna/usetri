import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { AnimatedCartBadge } from '~/src/components/layout/animated-cart-badge';
import { useSession } from '~/src/context/authentication-context';
import { NAVBAR_HEIGHT } from '~/src/lib/constants';
import { BadgePercent } from '~/src/lib/icons/BadgePercent';
import { ClipboardList } from '~/src/lib/icons/ClipboardList';
import { Search } from '~/src/lib/icons/Search';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { getNumberOfCartItems } from '~/src/lib/utils';
import { useGetCart } from '~/src/network/cart/cart';

export default function TabLayout() {
  const { brigaderActive } = useSession();
  const {
    data: { cart } = {},
  } = useGetCart();
  const cartItemsNumber = getNumberOfCartItems(cart);
  const { colorScheme } = useColorScheme();

  // Define theme-aware colors matching global.css
  const activeColor = colorScheme === 'dark' ? '#E0E0E0' : '#1E1E1E'; // foreground color (white/black)
  const inactiveColor = colorScheme === 'dark' ? '#A3A3A3' : '#737373'; // muted-foreground (64% gray)
  const tabBarBackground = colorScheme === 'dark' ? '#292929' : '#FFFFFF'; // card background (16% gray / white)
  const borderColor = colorScheme === 'dark' ? '#3D3D3D' : '#E5E7EB'; // border (24% gray / light gray)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: NAVBAR_HEIGHT,
          paddingBottom: 5,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tabBarBackground,
          borderTopColor: borderColor,
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          flexDirection: 'row',
        },
        headerShown: false,
        animation: 'fade', // or 'shift'
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 250,
          },
        },
      }}
    >
      <Tabs.Screen
        name="discounts-screen"
        options={{
          title: 'Zľavy',
          tabBarIcon: ({ color, focused }) => (
            <BadgePercent
              size={28}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search-screen"
        options={{
          title: 'Hĺadať',
          tabBarIcon: ({ color, focused }) => (
            <Search size={28} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: 'Zoznam',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <ClipboardList
                size={28}
                color={focused ? activeColor : inactiveColor}
              />
              <AnimatedCartBadge count={cartItemsNumber || 0} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={28}
              name="user"
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="brigader"
        options={{
          title: 'Nahravanie',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={28}
              name="upload"
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
        redirect={!brigaderActive}
      />
    </Tabs>
  );
}
