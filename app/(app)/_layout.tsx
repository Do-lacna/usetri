import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "~/global.css";

export default function AppLayout() {
  return (
    <>
      <StatusBar translucent={false} backgroundColor="white" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Detail produktu",
            presentation: "card",
            animation: "slide_from_right",
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <Stack.Screen
          name="main/price-comparison-modal/price-comparison-modal-screen"
          options={{
            title: "Porovnanie cien",

            headerShown: true,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="main/archived-cart/[id]"
          options={{
            title: "Detail košíka",

            headerShown: true,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="main/menu-screen/menu-screen"
          options={{
            title: "Nastavenia",
            headerShown: true,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackButtonDisplayMode: "minimal",
          }}
        />
      </Stack>
    </>
  );
}
