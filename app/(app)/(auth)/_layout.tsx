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
          // This ensures the header appears only on sign-up
        }}
      />
            <Stack.Screen
        name="forgotten-password"
        options={{
          headerShown: true,
          headerTitle: "Obnovenie hesla",
                      headerBackButtonDisplayMode: "minimal",

          // This ensures the header appears only on sign-up
        }}
      />
    </Stack>
  );
}
