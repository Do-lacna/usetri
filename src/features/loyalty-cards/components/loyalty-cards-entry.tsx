import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { useLoyaltyCards } from '~/src/hooks/use-loyalty-cards';
import { getShopLogo } from '~/src/utils/logo-utils';
import { LOYALTY_CARD_SHOPS } from '../constants';

const PREVIEW_LIMIT = 4;

export const LoyaltyCardsEntry = () => {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const { cards } = useLoyaltyCards();

  const previewShops = LOYALTY_CARD_SHOPS.slice(0, PREVIEW_LIMIT);
  const chevronColor = isDarkColorScheme ? '#B5B2D6' : '#9CA3AF';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.navigate('/main/loyalty-cards-screen/loyalty-cards-screen')
      }
      className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-4"
    >
      <View className="flex-1 pr-3">
        <Text className="text-base font-expose-bold text-foreground">
          {t('loyalty_cards.section_title')}
        </Text>
        <Text className="text-sm font-expose text-muted-foreground mt-0.5">
          {t('loyalty_cards.count', {
            count: cards.length,
            total: LOYALTY_CARD_SHOPS.length,
          })}
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="flex-row mr-2">
          {previewShops.map((shop, idx) => {
            const logo = getShopLogo(shop.id as 1 | 2 | 3 | 4);
            if (!logo) return null;
            return (
              <View
                key={shop.id}
                style={{
                  marginLeft: idx === 0 ? 0 : -10,
                  zIndex: previewShops.length - idx,
                }}
                className="w-8 h-8 rounded-full bg-white border border-border items-center justify-center"
              >
                <Image
                  source={logo.source}
                  resizeMode="contain"
                  style={{ width: 22, height: 22 }}
                />
              </View>
            );
          })}
        </View>
        <Ionicons name="chevron-forward" size={20} color={chevronColor} />
      </View>
    </TouchableOpacity>
  );
};
