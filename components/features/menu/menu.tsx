import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemeSwitch } from "~/components/features/settings/theme-switch";
import { useSettingsMenuItems } from "~/hooks/use-settings-menu-items";

export default function Menu() {
  const { menuSections } = useSettingsMenuItems();
  return (
    <View className="flex-1 bg-background px-2">
      {/* Menu content */}
      <ScrollView className="flex-1">
        {menuSections.map((section) => (
          <View key={section.id} className="mb-6">
            {/* Section heading (non-clickable) */}
            <Text className="px-2 py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </Text>

            {/* Menu items (clickable) */}
            {section.items.map((item) => (
              <View key={item.id} className="px-6 py-4 border-b border-border">
                {item.isThemeToggle ? (
                  <View className="flex-row items-center justify-between flex-1">
                    <Text className="text-base text-foreground flex-1">
                      {item.label}
                    </Text>
                    <View className="ml-4">
                      <ThemeSwitch showLabel={false} />
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity onPress={item.onPress}>
                    <Text className="text-base text-foreground">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
