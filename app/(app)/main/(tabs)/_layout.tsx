import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import { NAVBAR_HEIGHT } from "../../../../lib/constants";

export default function TabLayout() {
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
            <FontAwesome size={28} name="home" color={color} />
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
    </Tabs>
  );
}
