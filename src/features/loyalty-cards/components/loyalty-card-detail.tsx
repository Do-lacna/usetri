import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/src/components/ui/text';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { useLoyaltyCards } from '~/src/hooks/use-loyalty-cards';
import { getShopLogo } from '~/src/utils/logo-utils';
import { LOYALTY_CARD_SHOPS } from '../constants';
import { useAddLoyaltyCardImage } from '../use-add-loyalty-card-image';

type Props = {
  shopId: number;
};

export const LoyaltyCardDetail = ({ shopId }: Props) => {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const { getCardForShop, deleteCard } = useLoyaltyCards();
  const { pickAndSave, isPicking } = useAddLoyaltyCardImage();

  const replaceIconColor = isDarkColorScheme ? '#FFFFFF' : '#0A2540';

  const shop = LOYALTY_CARD_SHOPS.find(s => s.id === shopId);
  const card = getCardForShop(shopId);
  const logo = getShopLogo(shopId as 1 | 2 | 3 | 4);

  if (!shop || !card) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-8">
        <Ionicons name="card-outline" size={56} color="#9CA3AF" />
        <Text className="mt-4 text-center text-muted-foreground font-expose">
          {t('loyalty_cards.not_found')}
        </Text>
      </SafeAreaView>
    );
  }

  const confirmDelete = () => {
    Alert.alert(
      t('loyalty_cards.delete_title'),
      t('loyalty_cards.delete_message', { shop: shop.name }),
      [
        { text: t('loyalty_cards.cancel'), style: 'cancel' },
        {
          text: t('loyalty_cards.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteCard(shopId);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="flex-row items-center mb-6">
          {logo && (
            <View className="w-10 h-10 rounded-xl bg-white border border-border items-center justify-center mr-3 p-1.5">
              <Image
                source={logo.source}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          )}
          <Text className="text-2xl font-expose-bold text-foreground">
            {shop.name}
          </Text>
        </View>

        <View
          className="w-full rounded-2xl overflow-hidden bg-white"
          style={{
            aspectRatio: 3 / 4,
            maxHeight: '70%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Image
            source={{ uri: card.imageUri }}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-around px-6 pt-4 pb-2 border-t border-border">
        <TouchableOpacity
          onPress={() => pickAndSave(shopId)}
          disabled={isPicking}
          className="flex-1 items-center py-3"
        >
          {isPicking ? (
            <ActivityIndicator />
          ) : (
            <>
              <Ionicons
                name="refresh-outline"
                size={22}
                color={replaceIconColor}
              />
              <Text className="text-xs font-expose mt-1 text-foreground">
                {t('loyalty_cards.replace')}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <View className="w-px h-10 bg-border" />
        <TouchableOpacity
          onPress={confirmDelete}
          className="flex-1 items-center py-3"
        >
          <Ionicons name="trash-outline" size={22} color="#DC2626" />
          <Text className="text-xs font-expose mt-1 text-red-600">
            {t('loyalty_cards.delete')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
