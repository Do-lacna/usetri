// screens/MenuScreen.tsx
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define types for menu items
interface MenuItem {
  id: string;
  label: string;
  onPress: () => void;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

// Menu data structure
const menuSections: MenuSection[] = [
  {
    id: "account",
    title: "Account",
    items: [
      {
        id: "profile",
        label: "My Profile",
        onPress: () => router.push("/profile"),
      },
      {
        id: "password",
        label: "Change Password",
        onPress: () => router.push("/change-password"),
      },
      {
        id: "logout",
        label: "Log Out",
        onPress: () => {
          // Add confirmation if needed
          router.replace("/login");
        },
      },
    ],
  },
  {
    id: "app",
    title: "Application",
    items: [
      {
        id: "settings",
        label: "Settings",
        onPress: () => router.push("/settings"),
      },
      {
        id: "notifications",
        label: "Notifications",
        onPress: () => router.push("/notifications"),
      },
      {
        id: "help",
        label: "Help & Support",
        onPress: () => router.push("/support"),
      },
    ],
  },
];

export default function Menu() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold">Menu</Text>
      </View>

      {/* Menu content */}
      <ScrollView className="flex-1">
        {menuSections.map((section) => (
          <View key={section.id} className="mb-6">
            {/* Section heading (non-clickable) */}
            <Text className="px-6 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              {section.title}
            </Text>

            {/* Menu items (clickable) */}
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                className="px-6 py-4 border-b border-gray-100"
              >
                <Text className="text-base text-gray-800">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
