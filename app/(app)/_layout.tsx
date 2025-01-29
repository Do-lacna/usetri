import { Stack } from "expo-router";
import "~/global.css";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="product/[id]"
        options={{
          // Optional: Add presentation style
          title: "Detail produktu",
          presentation: "card",
          // Optional: Add animations
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="main/modal/index"
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
    </Stack>
  );
}
