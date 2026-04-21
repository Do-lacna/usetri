import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/src/components/ui/text';
import { useLoyaltyCards } from '~/src/hooks/use-loyalty-cards';
import { LOYALTY_CARD_SHOPS } from '../constants';
import { LoyaltyCardTile } from './loyalty-card-tile';

export const LoyaltyCardsManager = () => {
  const { t } = useTranslation();
  const { getCardForShop, cards } = useLoyaltyCards();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 32,
        }}
      >
        <Text className="text-sm font-expose text-muted-foreground mb-1">
          {t('loyalty_cards.manage_subtitle')}
        </Text>
        <Text className="text-sm font-expose text-muted-foreground mb-6">
          {t('loyalty_cards.count', {
            count: cards.length,
            total: LOYALTY_CARD_SHOPS.length,
          })}
        </Text>

        <View className="items-center">
          {LOYALTY_CARD_SHOPS.map(shop => (
            <LoyaltyCardTile
              key={shop.id}
              shopId={shop.id}
              card={getCardForShop(shop.id)}
              layout="stacked"
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
