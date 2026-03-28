import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AnimatedCartBadge } from '~/src/components/layout/animated-cart-badge';
import { useSession } from '~/src/context/authentication-context';
import { COLORS, NAVBAR_HEIGHT } from '~/src/lib/constants';
import { BadgePercent } from '~/src/lib/icons/BadgePercent';
import { ClipboardList } from '~/src/lib/icons/ClipboardList';
import { Search } from '~/src/lib/icons/Search';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { getNumberOfCartItems } from '~/src/lib/utils';
import { useGetCart } from '~/src/network/cart/cart';

export default function TabLayout() {
  const { t } = useTranslation();
  const { brigaderActive, isGuest } = useSession();
  const {
    data: { cart } = {},
  } = useGetCart();
  const cartItemsNumber = getNumberOfCartItems(cart);
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';

  const activeColor = isDark ? COLORS.white : COLORS.v6; // bright white / deep violet
  const inactiveColor = isDark ? COLORS.n6 : COLORS.grey; // muted lavender / grey
  const tabBarBackground = isDark ? COLORS.i1 : COLORS.white;
  const borderColor = isDark ? COLORS.i3 : COLORS.n5;

  // Active indicator pill for dark mode (modern tab bar UX)
  const ActiveIndicator = ({
    children,
    focused,
  }: { children: React.ReactNode; focused: boolean }) => (
    <View
      style={{
        backgroundColor: isDark && focused ? `${COLORS.v1}30` : 'transparent',
        borderRadius: 16,
        paddingHorizontal: isDark && focused ? 12 : 0,
        paddingVertical: isDark && focused ? 4 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );

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
          borderTopWidth: isDark ? 0 : 1,
          ...(isDark && {
            shadowColor: COLORS.v1,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }),
        },
        tabBarItemStyle: {
          alignItems: 'center',
          flexDirection: 'row',
        },
        tabBarLabelStyle: {
          fontFamily: 'Expose-Bold',
          fontSize: 11,
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
          title: t('navigation.discounts_tab'),
          tabBarIcon: ({ color, focused }) => (
            <ActiveIndicator focused={focused}>
              <BadgePercent
                size={28}
                color={focused ? activeColor : inactiveColor}
              />
            </ActiveIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="search-screen"
        options={{
          title: t('navigation.search_tab'),
          tabBarIcon: ({ color, focused }) => (
            <ActiveIndicator focused={focused}>
              <Search size={28} color={focused ? activeColor : inactiveColor} />
            </ActiveIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: t('navigation.list_tab'),
          tabBarIcon: ({ color, focused }) => (
            <ActiveIndicator focused={focused}>
              <View style={{ position: 'relative' }}>
                <ClipboardList
                  size={28}
                  color={focused ? activeColor : inactiveColor}
                />
                {!isGuest && <AnimatedCartBadge count={cartItemsNumber || 0} />}
              </View>
            </ActiveIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile_tab'),
          tabBarIcon: ({ color, focused }) => (
            <ActiveIndicator focused={focused}>
              <FontAwesome
                size={28}
                name="user"
                color={focused ? activeColor : inactiveColor}
              />
            </ActiveIndicator>
          ),
        }}
      />
      <Tabs.Screen
        name="brigader"
        options={{
          title: t('navigation.upload_tab'),
          tabBarIcon: ({ color, focused }) => (
            <ActiveIndicator focused={focused}>
              <FontAwesome
                size={28}
                name="upload"
                color={focused ? activeColor : inactiveColor}
              />
            </ActiveIndicator>
          ),
        }}
        redirect={isGuest || !brigaderActive}
      />
    </Tabs>
  );
}
