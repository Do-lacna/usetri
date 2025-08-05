import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          headerTitle: "Registrácia",
          headerBackTitle: "Prihlásenie",
        }}
      />
      <Stack.Screen
        name="forgotten-password"
        options={{
          headerShown: true,
          headerTitle: "Obnovenie hesla",
          headerBackButtonDisplayMode: "minimal",

        }}
      />
    </Stack>
  );
}
