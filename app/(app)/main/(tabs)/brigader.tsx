import type React from 'react';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryVerificationScreen from '../../../../src/features/brigader/components/category-verification-screen';
import DiscountConfirmationScreen from '../../../../src/features/brigader/components/discount-confirmation-screen';

type BrigaderMode = 'discounts' | 'categories';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-3 px-4 rounded-lg ${
      isActive ? 'bg-primary' : 'bg-muted'
    }`}
  >
    <Text
      className={`text-center font-medium ${
        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function BrigaderScreen() {
  const [mode, setMode] = useState<BrigaderMode>('discounts');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Tab Switcher */}
      <View className="flex-row gap-2 px-4 py-3 bg-background border-b border-border">
        <TabButton
          label="Potvrdenie zliav"
          isActive={mode === 'discounts'}
          onPress={() => setMode('discounts')}
        />
        <TabButton
          label="Kategórie produktov"
          isActive={mode === 'categories'}
          onPress={() => setMode('categories')}
        />
      </View>

      {/* Content */}
      {mode === 'discounts' ? (
        <DiscountConfirmationScreen />
      ) : (
        <CategoryVerificationScreen />
      )}
    </SafeAreaView>
  );
}
