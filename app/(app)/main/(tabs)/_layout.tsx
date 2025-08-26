import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { BadgePercent } from "~/lib/icons/BadgePercent";
import { ClipboardList } from "~/lib/icons/ClipboardList";
import { Search } from "~/lib/icons/Search";
import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import { AnimatedCartBadge } from "../../../../components/layout/animated-cart-badge";
import { useSession } from "../../../../context/authentication-context";
import { NAVBAR_HEIGHT } from "../../../../lib/constants";
import { useColorScheme } from "../../../../lib/useColorScheme";
import { getNumberOfCartItems } from "../../../../lib/utils";

export default function TabLayout() {
  const { brigaderActive } = useSession();
  const { data: { cart } = {} } = ({} = useGetHybridCart());
  const cartItemsNumber = getNumberOfCartItems(cart);
  const { colorScheme } = useColorScheme();

  // Define theme-aware colors
  const activeColor = colorScheme === "dark" ? "#FFFFFF" : "#000000"; // primary color
  const inactiveColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280"; // muted-foreground
  const tabBarBackground = colorScheme === "dark" ? "#1F2937" : "#FFFFFF"; // card background

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          height: NAVBAR_HEIGHT,
          paddingBottom: 5,
          paddingTop: 5,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tabBarBackground,
          borderTopColor: colorScheme === "dark" ? "#374151" : "#E5E7EB", // border color
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          alignItems: "center",
          flexDirection: "row",
        },
        headerShown: false,
        animation: "fade", // or 'shift'
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 250,
          },
        },
      }}
    >
      <Tabs.Screen
        name="discounts-screen"
        options={{
          title: "Zľavy",
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
          title: "Hĺadať",
          tabBarIcon: ({ color, focused }) => (
            <Search size={28} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Zoznam",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
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
          title: "Profil",
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
          title: "Nahravanie",
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
