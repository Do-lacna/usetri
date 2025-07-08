import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { BadgePercent } from "~/lib/icons/BadgePercent";
import { ClipboardList } from "~/lib/icons/ClipboardList";

import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import { useSession } from "../../../../context/authentication-context";
import { NAVBAR_HEIGHT, PRIMARY_HEX } from "../../../../lib/constants";
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
          height: NAVBAR_HEIGHT, // Adjust this height as needed
          paddingBottom: 5,
          alignItems: "center", // Center items along the cross axis
          justifyContent: "center", // Center items along the main axis
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
            // <FontAwesome size={28} name='percent' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Zoznam",
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList size={28} color={focused ? "black" : color} />
          ),
          tabBarBadgeStyle: { backgroundColor: PRIMARY_HEX },
          tabBarBadge: cartItemsNumber ? cartItemsNumber : undefined,
        }}
      />
      {/* TODO allow this when A/B testing starts */}
      {/* <Tabs.Screen
        name="shopping-list-alternative"
        options={{
          title: "Nakupny zoznam alternativ",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} name="shopping-basket" color={color} />
          ),
          tabBarBadgeStyle: { backgroundColor: PRIMARY_HEX },
          tabBarBadge: productsInCart ? productsInCart : undefined,
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      {/* TODO condition this under admin rights */}
      {/* {
        brigaderActive && ( */}
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
