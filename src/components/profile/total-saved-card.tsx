import type React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Platform, View } from 'react-native';
import { CalendarOutline } from '../../lib/icons/CalendarOutline';
import { TrendingUp } from '../../lib/icons/TrendingUp';
import { useGetArchivedCart } from '../../network/customer/customer';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Text } from '../ui/text';

const TotalSavedCard: React.FC = () => {
  const { t } = useTranslation();

  const {
    isLoading,
    data: { total_price_spared = 0, total_price_spared_last_month = 0 } = {},
  } = useGetArchivedCart();

  if (isLoading) {
    return <Skeleton className="w-full  h-28 bg-muted p-4" />;
  }

  return (
    <Card className="w-full overflow-hidden bg-card border border-border">
      <ImageBackground
        source={require('~/assets/images/pattern.png')}
        className="px-4 py-2"
        imageStyle={{ resizeMode: 'cover', opacity: 0.2 }}
      >
        <Text className="text-lg font-expose-medium text-card-foreground">
          {t('profile_screen.your_savings')}
        </Text>
        <View className="flex-row space-x-4">
          <View
            className={`flex-1 rounded-2xl p-4  ${
              Platform.OS === 'ios' ? 'shadow-lg' : ''
            }`}
          >
            <View className="flex-row items-center mb-2">
              <CalendarOutline size={20} className="text-card-foreground" />
              <Text className="text-sm font-expose-medium ml-2 text-card-foreground">
                {t('profile_screen.this_month')}
              </Text>
            </View>
            <Text className="text-2xl font-expose-bold text-card-foreground">
              {total_price_spared_last_month.toFixed(2)} €
            </Text>
          </View>

          {/* Total Savings */}
          <View
            className={`flex-1 rounded-2xl p-4  ${
              Platform.OS === 'ios' ? 'shadow-lg' : ''
            }`}
          >
            <View className="flex-row items-center mb-2">
              <TrendingUp size={20} className="text-card-foreground" />
              <Text className="text-sm font-expose-medium ml-2 text-card-foreground">
                {t('profile_screen.total')}
              </Text>
            </View>
            <Text className="text-2xl font-expose-bold text-card-foreground">
              {total_price_spared.toFixed(2)} €
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Card>
  );
};

TotalSavedCard.displayName = 'TotalSavedCard';

export { TotalSavedCard };
