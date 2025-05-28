import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useSession } from "../../../../context/authentication-context";
import { NAVBAR_HEIGHT, PRIMARY_HEX } from "../../../../lib/constants";
import { getNumberOfCartItems } from "../../../../lib/utils";
import { useGetCart } from "../../../../network/customer/customer";
import { useGetProductCart } from "../../../../network/product-cart/product-cart";

export default function TabLayout() {
  const { brigaderActive } = useSession();

  const { data: { cart } = {} } = ({} = useGetCart());

  const cartItemsNumber = getNumberOfCartItems(cart);
  const {
    data: { cart: { specific_products = [], total_price } = {} } = {},
    isLoading: isCartLoading,
  } = useGetProductCart();

  const productsInCart = [...(specific_products ?? [])].length;

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

        // tabBarItemStyle: {
        //   backgroundColor: "blue",
        //   justifyContent: "center",
        //   margin: 10,
        // },
        // tabBarIconStyle: {
        //   height: "100%",
        //   backgroundColor: "green",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignContent: "center",
        //   alignItems: "center",
        // },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="search-screen"
        options={{
          title: "Hladat",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Nakupny zoznam",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="shopping-cart" color={color} />
          ),
          tabBarBadgeStyle: { backgroundColor: PRIMARY_HEX },
          tabBarBadge: cartItemsNumber ? cartItemsNumber : undefined,
        }}
      />
      <Tabs.Screen
        name="shopping-list-alternative"
        options={{
          title: "Nakupny zoznam alternativ",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} name="shopping-basket" color={color} />
          ),
          tabBarBadgeStyle: { backgroundColor: PRIMARY_HEX },
          tabBarBadge: productsInCart ? productsInCart : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
          // headerRight: () => (
          //   <IconButton className="mx-3" onPress={performSignOut}>
          //     <LogOut size={20} />
          //   </IconButton>
          // ),
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
