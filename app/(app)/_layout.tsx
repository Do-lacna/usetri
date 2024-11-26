import { Redirect, Stack } from "expo-router";
import * as React from "react";
import { Text } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import "~/global.css";
import { useSession } from "../../context/authentication-context";

export default function AppLayout() {
  const { session, user, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

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
