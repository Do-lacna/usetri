import { router } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  const handleGoHome = () => {
    // Always replace (don't go back) to avoid returning to broken screen
    router.replace('/(app)' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Icon */}
        <View className="mb-6">
          <AlertCircle size={80} className="text-muted-foreground" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-foreground mb-2 text-center">
          {t('not_found.title')}
        </Text>

        {/* Description */}
        <Text className="text-base text-muted-foreground mb-8 text-center max-w-sm">
          {t('not_found.description')}
        </Text>

        {/* Go Home Button */}
        <Pressable
          onPress={handleGoHome}
          className="bg-primary px-8 py-4 rounded-lg active:opacity-80"
        >
          <Text className="text-primary-foreground font-semibold text-base">
            {t('not_found.go_back')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
