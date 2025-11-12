import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { cn } from '~/src/lib/utils';

interface LanguageSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitch({
  className,
  showLabel = true,
}: LanguageSwitchProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lang: string) => {
    // Map to the actual language codes used in i18n config
    const languageCode = lang === 'sk' ? 'sk-SK' : 'ar-AR';

    if (currentLanguage !== languageCode) {
      i18n.changeLanguage(languageCode);
    }
  };

  // Normalize current language for comparison
  const isSlovak = currentLanguage === 'sk' || currentLanguage === 'sk-SK';
  const isEnglish =
    currentLanguage === 'en' ||
    currentLanguage === 'ar-AR' ||
    currentLanguage === 'en-US';

  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      {showLabel && (
        <View className="flex-row items-center flex-1">
          <Text className="text-base text-foreground">Jazyk</Text>
        </View>
      )}

      {/* Segmented Control */}
      <View className="flex-row bg-muted rounded-lg p-0.5 border border-border">
        {/* SK Button */}
        <Pressable
          onPress={() => handleLanguageChange('sk')}
          className={cn(
            'px-3 py-1 rounded-md',
            isSlovak ? 'bg-background' : 'bg-transparent',
          )}
        >
          <Text
            className={cn(
              'text-sm font-semibold',
              isSlovak ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            SK
          </Text>
        </Pressable>

        {/* EN Button */}
        <Pressable
          onPress={() => handleLanguageChange('en')}
          className={cn(
            'px-3 py-1 rounded-md',
            isEnglish ? 'bg-background' : 'bg-transparent',
          )}
        >
          <Text
            className={cn(
              'text-sm font-semibold',
              isEnglish ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            EN
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
