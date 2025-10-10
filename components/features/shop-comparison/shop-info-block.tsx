import { Award, TrendingUp, AlertCircle, Info } from 'lucide-react-native';
import type React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type ShopInfoType = 'cheapest' | 'more_expensive' | 'most_expensive' | 'missing_items';

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
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: '#059669',
          icon: Award,
          title: t('best_price'),
          subtitle: t('cheapest_of_stores', { count: totalShops }),
        };

      case 'more_expensive':
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          iconColor: '#6B7280',
          icon: Info,
          title: t('more_expensive_percentage', { percentage: percentageMore.toFixed(1) }),
          subtitle: t('compared_to_cheapest'),
        };

      case 'most_expensive':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          iconColor: '#DC2626',
          icon: TrendingUp,
          title: t('most_expensive'),
          subtitle: t('highest_price_option'),
        };

      case 'missing_items':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: '#2563EB',
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
        <Text className={`text-lg font-semibold ${config.textColor} ml-2`}>
          {config.title}
        </Text>
      </View>
      <Text className={`text-sm ${config.textColor.replace('700', '600')} mt-1`}>
        {config.subtitle}
      </Text>
    </View>
  );
};
