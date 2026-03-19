import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { ImageBackground, Platform, View } from 'react-native';
import { COLORS } from '../../lib/constants';
import { useColorScheme } from '../../lib/useColorScheme';
import { useGetArchivedCart } from '../../network/customer/customer';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Text } from '../ui/text';

const TotalSavedCard: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const iconColor = COLORS.black;

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
        imageStyle={{ resizeMode: 'repeat', opacity: 0.2 }}
      >
        <Text className="text-lg font-semibold text-card-foreground">
          Vaše úspory
        </Text>
        <View className="flex-row space-x-4">
          <View
            className={`flex-1 rounded-2xl p-4  ${
              Platform.OS === 'ios' ? 'shadow-lg' : ''
            }`}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={20} color={iconColor} />
              <Text className="text-sm font-semibold ml-2 text-card-foreground">
                Tento mesiac
              </Text>
            </View>
            <Text className="text-2xl font-bold text-card-foreground">
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
              <Ionicons
                name="trending-up-outline"
                size={20}
                color={iconColor}
              />
              <Text className="text-sm font-semibold ml-2 text-card-foreground">
                Celkovo
              </Text>
            </View>
            <Text className="text-2xl font-bold text-card-foreground">
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
