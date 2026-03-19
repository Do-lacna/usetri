import { Award, TrendingUp, AlertCircle, Info } from 'lucide-react-native';
import type React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '~/src/lib/constants';

type ShopInfoType =
  | 'cheapest'
  | 'more_expensive'
  | 'most_expensive'
  | 'missing_items';

interface ShopInfoBlockProps {
  type: ShopInfoType;
  missingItemsCount?: number;
  percentageMore?: number;
  totalShops?: number;
}

export const ShopInfoBlock: React.FC<ShopInfoBlockProps> = ({
  type,
  missingItemsCount = 0,
  percentageMore = 0,
  totalShops = 1,
}) => {
  const { t } = useTranslation('common');

  const getInfoConfig = () => {
    switch (type) {
      case 'cheapest':
        return {
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          iconColor: COLORS.success,
          icon: Award,
          title: t('best_price'),
          subtitle: t('cheapest_of_stores', { count: totalShops }),
        };

      case 'more_expensive':
        return {
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          iconColor: COLORS.n6,
          icon: Info,
          title: t('more_expensive_percentage', {
            percentage: percentageMore.toFixed(1),
          }),
          subtitle: t('compared_to_cheapest'),
        };

      case 'most_expensive':
        return {
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          iconColor: COLORS.error,
          icon: TrendingUp,
          title: t('most_expensive'),
          subtitle: t('highest_price_option'),
        };

      case 'missing_items':
        return {
          bgColor: 'bg-accent/20',
          textColor: 'text-accent-foreground',
          iconColor: COLORS.v1,
          icon: AlertCircle,
          title: t('missing_items_count', { count: missingItemsCount }),
          subtitle: t('price_for_available_items'),
        };

      default:
        return null;
    }
  };

  const config = getInfoConfig();

  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <View className={`${config.bgColor} px-3 py-2 rounded-lg mb-2`}>
      <View className="flex-row items-center">
        <IconComponent size={18} color={config.iconColor} />
        <Text className={`text-lg font-expose-bold ${config.textColor} ml-2`}>
          {config.title}
        </Text>
      </View>
      <Text className={`text-sm font-expose ${config.textColor} opacity-80 mt-1`}>
        {config.subtitle}
      </Text>
    </View>
  );
};
