import {  Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import "~/global.css";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, headerRight: () => <ThemeToggle /> }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: false,
          // Optional: Add presentation style
          presentation: "card",
          // Optional: Add animations
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
