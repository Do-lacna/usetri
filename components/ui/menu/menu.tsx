// screens/MenuScreen.tsx
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSettingsMenuItems } from "~/hooks/use-settings-menu-items";

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

export default function Menu() {
  const { menuSections } = useSettingsMenuItems();
  return (
    <View className="flex-1 bg-white px-2">
      {/* Menu content */}
      <ScrollView className="flex-1">
        {menuSections.map((section) => (
          <View key={section.id} className="mb-6">
            {/* Section heading (non-clickable) */}
            <Text className="px-2 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
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
    </View>
  );
}
