import { format } from 'date-fns';
import { router } from 'expo-router';
import type React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DATE_FORMAT } from '../../lib/constants';
import { getShopById } from '../../lib/utils';
import { useGetShops } from '../../network/query/query';
import { getShopLogo } from '../../utils/logo-utils';
import { Card } from '../ui/card';
import { Text } from '../ui/text';

export interface SavedCartCardProps {
  id: number;
  shopId: number;
  totalPrice: number;
  savedAmount: number;
  createdDate: string;
}

const SavedCartCard: React.FC<SavedCartCardProps> = ({
  id,
  shopId,
  totalPrice,
  savedAmount = 0,
  createdDate,
}) => {
  const {
    data: { shops = [] } = {},
  } = useGetShops();
  const shopName = getShopById(shopId, shops ?? [])?.name;

  return (
    <View className="w-full mb-4" style={styles.cardContainer}>
      <TouchableOpacity
        onPress={() => router.navigate(`/main/archived-cart/${id}`)}
        className="p-4 rounded-xl bg-card border border-border relative overflow-hidden"
      >
        <Image
          className="absolute h-20 w-20 -rotate-45 top-1 opacity-30 -left-2"
          {...getShopLogo(shopId as any)}
        />

        <View className="ml-12 flex-row items-center justify-between space-x-2">
          <View className="flex-1">
            <Text
              className="font-semibold text-lg mb-1 text-card-foreground"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Nákup v {shopName}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {format(createdDate, DATE_FORMAT)}
            </Text>
          </View>
          <View className="flex flex-col items-center">
            <Text className="text-lg font-bold text-card-foreground">
              {totalPrice.toFixed(2)} €
            </Text>
            <View className="bg-green-100 px-2 py-1 rounded-full mt-1">
              <Text className="text-xs font-medium text-green-700">
                Ušetrené {savedAmount.toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

SavedCartCard.displayName = 'SavedCartCard';

const styles = StyleSheet.create({
  cardContainer: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
});

export { SavedCartCard };
