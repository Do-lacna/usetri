import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { LogOut } from "~/lib/icons/Log-out";
import IconButton from "../../../../components/icon-button";
import { useSession } from "../../../../context/authentication-context";
import { NAVBAR_HEIGHT } from "../../../../lib/constants";

export default function TabLayout() {
  const { signOut } = useSession();

  const performSignOut = () => {
    signOut();
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "primary",
        tabBarStyle: { height: NAVBAR_HEIGHT },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hladat",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: "Nakupny zoznam",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="shopping-cart" color={color} />
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
          headerRight: () => (
            <IconButton className="mx-3" onPress={performSignOut}>
              <LogOut size={20} />
            </IconButton>
          ),
        }}
      />
    </Tabs>
  );
}
