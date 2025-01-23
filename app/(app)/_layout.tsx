import { Stack } from "expo-router";
import "~/global.css";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="product/[id]"
        options={{
          // Optional: Add presentation style
          presentation: "card",
          // Optional: Add animations
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="main/modal/index"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
