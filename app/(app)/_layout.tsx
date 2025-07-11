import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "~/global.css";

export default function AppLayout() {
  return (
    <>
      <StatusBar translucent={false} />
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
        {/* <Stack.Screen
        name="main/scan/scan-screen"
        options={{
          // Optional: Add presentation style
          title: 'Sken produktov',
          presentation: 'card',
          // Optional: Add animations
          animation: 'slide_from_right',
          headerShown: true,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      /> */}
        <Stack.Screen
          name="main/price-comparison-modal/price-comparison-modal-screen"
          options={{
            title: "Porovnanie cien",
            // headerStyle: {
            //   backgroundColor: "#f4f4f4", // Optional: customize header background
            // },
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
            // headerStyle: {
            //   backgroundColor: "#f4f4f4", // Optional: customize header background
            // },
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
            headerBackTitleStyle: false,
          }}
        />
      </Stack>
    </>
  );
}
