import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { BadgePercent } from "~/lib/icons/BadgePercent";
import { ClipboardList } from "~/lib/icons/ClipboardList";
import { Search } from "~/lib/icons/Search";
import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import { AnimatedCartBadge } from "../../../../components/ui/animated-cart-badge";
import { useSession } from "../../../../context/authentication-context";
import { NAVBAR_HEIGHT } from "../../../../lib/constants";
import { getNumberOfCartItems } from "../../../../lib/utils";

export default function TabLayout() {
  const { brigaderActive } = useSession();
  const { data: { cart } = {} } = ({} = useGetHybridCart());
  const cartItemsNumber = getNumberOfCartItems(cart);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "primary",
        tabBarStyle: {
          height: NAVBAR_HEIGHT,
          paddingBottom: 5,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarItemStyle: {
          alignItems: "center",
          flexDirection: "row",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="discounts-screen"
        options={{
          title: "Zľavy",
          tabBarIcon: ({ color, focused }) => (
            <BadgePercent size={28} color={focused ? "black" : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search-screen"
        options={{
          title: "Hĺadať",
          tabBarIcon: ({ color, focused }) => (
            <Search size={28} color={focused ? "black" : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Zoznam",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "relative" }}>
              <ClipboardList size={28} color={focused ? "black" : color} />
              <AnimatedCartBadge count={cartItemsNumber || 0} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="brigader"
        options={{
          title: "Nahravanie",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="upload" color={color} />
          ),
        }}
        redirect={!brigaderActive}
      />
    </Tabs>
  );
}
