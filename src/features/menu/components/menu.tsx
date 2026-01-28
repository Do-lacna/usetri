import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LanguageSwitch } from '~/src/features/settings/components/language-switch';
import { ThemeSwitch } from '~/src/features/settings/components/theme-switch';
import {
  useSettingsMenuItems,
  type MenuItem,
} from '~/src/hooks/use-settings-menu-items';

const MenuItemRow = ({ item }: { item: MenuItem }) => {
  const IconComponent = item.icon;

  if (item.isThemeToggle) {
    return (
      <View className="flex-row items-center justify-between flex-1">
        <Text className="text-base text-foreground flex-1">{item.label}</Text>
        <View className="ml-4">
          <ThemeSwitch showLabel={false} />
        </View>
      </View>
    );
  }

  if (item.isLanguageToggle) {
    return (
      <View className="flex-row items-center justify-between flex-1">
        <Text className="text-base text-foreground flex-1">{item.label}</Text>
        <View className="ml-4">
          <LanguageSwitch showLabel={false} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={item.onPress ?? (() => {})}
      className="flex-row items-center"
    >
      {IconComponent && (
        <IconComponent
          size={20}
          className={
            item.isDestructive ? 'text-destructive' : 'text-foreground'
          }
        />
      )}
      <Text
        className={`text-base ${item.isDestructive ? 'text-destructive' : 'text-foreground'} ${IconComponent ? 'ml-3' : ''}`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default function Menu() {
  const { menuSections } = useSettingsMenuItems();
  return (
    <View className="flex-1 bg-background px-2">
      {/* Menu content */}
      <ScrollView className="flex-1">
        {menuSections.map(section => (
          <View key={section.id} className="mb-6">
            {/* Section heading (non-clickable) */}
            {section.title ? (
              <Text className="px-2 py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </Text>
            ) : null}

            {/* Menu items (clickable) */}
            {section.items.map(item => (
              <View key={item.id} className="px-6 py-4 border-b border-border">
                <MenuItemRow item={item} />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
