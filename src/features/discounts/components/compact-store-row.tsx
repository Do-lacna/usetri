import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRIMARY_HEX } from '~/src/lib/constants';
import type { DiscountStatsDto, ShopExtendedDto } from '~/src/network/model';
import { getShopCoverImage } from '../../../utils/logo-utils';
import {
  getStoreDiscountsCount,
  getStoreDisplayName,
} from '../utils/store-utils';

interface CompactStoreRowProps {
  shops: ShopExtendedDto[];
  activeStoreId: number | null;
  stats: DiscountStatsDto[];
  onStoreSelect: (storeId: number, index: number) => void;
}

export const CompactStoreRow: React.FC<CompactStoreRowProps> = ({
  shops,
  activeStoreId,
  stats,
  onStoreSelect,
}) => {
  const { t } = useTranslation();
  const { width: screenWidth } = Dimensions.get('window');

  // Calculate width for each shop to fit all 4 in a row
  const shopWidth = (screenWidth - 48) / 4; // 48 = total horizontal padding and gaps

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        gap: 8,
        alignItems: 'center',
      }}
    >
      {shops?.map((store, index) => {
        const isActive = store?.id === activeStoreId;
        const discountCount = getStoreDiscountsCount(Number(store?.id), stats);
        const storeImage = getShopCoverImage(Number(store?.id));

        return (
          <TouchableOpacity
            key={store.id}
            onPress={() => onStoreSelect(Number(store?.id), index)}
            style={{
              width: shopWidth,
              height: 70,
              borderRadius: 8,
              overflow: 'hidden',
              transform: [{ scale: isActive ? 1 : 0.95 }],
              opacity: isActive ? 1 : 0.8,
            }}
          >
            <ImageBackground
              source={storeImage}
              style={{ flex: 1 }}
              resizeMode="cover"
              imageStyle={{ borderRadius: 8 }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isActive
                    ? 'rgba(0, 0, 0, 0.35)'
                    : 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 8,
                }}
              />

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? '700' : '600',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {getStoreDisplayName(store.name)}
                </Text>
                {discountCount > 0 && (
                  <Text
                    style={{
                      fontSize: 9,
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginTop: 2,
                    }}
                  >
                    {discountCount}
                  </Text>
                )}
              </View>

              {isActive && (
                <>
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderWidth: 2,
                      borderColor: PRIMARY_HEX,
                      borderRadius: 8,
                      pointerEvents: 'none',
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      backgroundColor: PRIMARY_HEX,
                      borderRadius: 4,
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                    }}
                  />
                </>
              )}
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
