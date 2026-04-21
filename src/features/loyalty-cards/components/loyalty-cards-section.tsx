import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import { useLoyaltyCards } from '~/src/hooks/use-loyalty-cards';
import { LOYALTY_CARD_SHOPS } from '../constants';
import { LoyaltyCardTile } from './loyalty-card-tile';

export const LoyaltyCardsSection = () => {
  const { t } = useTranslation();
  const { getCardForShop, cards } = useLoyaltyCards();

  return (
    <View className="mb-2">
      <View className="flex-row items-end justify-between mb-4 px-1">
        <Text className="text-lg font-semibold text-foreground">
          {t('loyalty_cards.section_title')}
        </Text>
        <Text className="text-sm text-muted-foreground">
          {t('loyalty_cards.count', {
            count: cards.length,
            total: LOYALTY_CARD_SHOPS.length,
          })}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2, paddingVertical: 6 }}
      >
        {LOYALTY_CARD_SHOPS.map(shop => (
          <LoyaltyCardTile
            key={shop.id}
            shopId={shop.id}
            card={getCardForShop(shop.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
