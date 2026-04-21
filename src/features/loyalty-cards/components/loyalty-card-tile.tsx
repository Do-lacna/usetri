import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '~/src/components/ui/text';
import { useColorScheme } from '~/src/lib/useColorScheme';
import { getShopLogo } from '~/src/utils/logo-utils';
import { LOYALTY_CARD_SHOPS } from '../constants';
import type { LoyaltyCard } from '../types';
import { useAddLoyaltyCardImage } from '../use-add-loyalty-card-image';

const CARD_WIDTH = 260;
const CARD_HEIGHT = 150;
const STACKED_WIDTH = 340;

type Props = {
  shopId: number;
  card?: LoyaltyCard;
  layout?: 'horizontal' | 'stacked';
};

export const LoyaltyCardTile = ({
  shopId,
  card,
  layout = 'horizontal',
}: Props) => {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const shop = LOYALTY_CARD_SHOPS.find(s => s.id === shopId);
  const { pickAndSave, isPicking } = useAddLoyaltyCardImage();
  if (!shop) return null;

  const logo = getShopLogo(shopId as 1 | 2 | 3 | 4);
  const layoutStyle =
    layout === 'stacked'
      ? {
          width: STACKED_WIDTH,
          maxWidth: '100%' as const,
          marginRight: 0,
          marginBottom: 14,
        }
      : null;

  const mutedIconColor = isDarkColorScheme ? '#B5B2D6' : '#6B7280';
  const patternImageStyle = {
    resizeMode: 'cover' as const,
    opacity: isDarkColorScheme ? 0.08 : 0.12,
    tintColor: isDarkColorScheme ? '#FFFFFF' : undefined,
  };

  if (!card) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isPicking}
        onPress={() => pickAndSave(shopId)}
        style={[styles.card, layoutStyle]}
        className="bg-transparent border-2 border-dashed border-border"
      >
        <View className="flex-1 items-center justify-center">
          {logo && (
            <Image
              source={logo.source}
              resizeMode="contain"
              style={styles.emptyLogo}
            />
          )}
          <View className="flex-row items-center mt-3">
            <Ionicons name="image-outline" size={18} color={mutedIconColor} />
            <Text className="ml-1 text-sm font-expose text-muted-foreground">
              {t('loyalty_cards.add_for_shop', { shop: shop.name })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.navigate(`/main/loyalty-card/${shopId}`)}
      style={[styles.card, layoutStyle]}
      className="bg-card border border-border"
    >
      <ImageBackground
        source={require('~/assets/images/pattern.png')}
        style={StyleSheet.absoluteFill}
        imageStyle={patternImageStyle}
      />

      <View className="flex-1 p-4 flex-row items-center">
        <View style={styles.preview} className="bg-muted">
          <Image
            source={{ uri: card.imageUri }}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View className="flex-1 ml-4 justify-between h-full py-1">
          <View className="flex-row items-start justify-between">
            <Text className="font-expose-bold text-base tracking-wide text-card-foreground">
              {shop.name}
            </Text>
            {logo && (
              <View
                style={styles.logoBadge}
                className="bg-white border border-border"
              >
                <Image
                  source={logo.source}
                  resizeMode="contain"
                  style={styles.logoImage}
                />
              </View>
            )}
          </View>

          <View className="flex-row items-center">
            <Ionicons name="qr-code-outline" size={14} color={mutedIconColor} />
            <Text className="ml-1 text-xs font-expose text-muted-foreground">
              {t('loyalty_cards.tap_to_show')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  emptyLogo: {
    width: 60,
    height: 36,
    opacity: 0.55,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
