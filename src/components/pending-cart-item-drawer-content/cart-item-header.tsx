import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
const PLACEHOLDER_PRODUCT_IMAGE = require('~/assets/images/product_placeholder.jpg');
import Divider from '../ui/divider';
import { Text } from '../ui/text';

interface CartItemHeaderProps {
  image_url?: string | null;
  title?: string | null;
  amountUnit?: string | null;
  onDismiss?: () => void;
}

export const CartItemHeader: React.FC<CartItemHeaderProps> = ({
  image_url,
  title,
  amountUnit,
  onDismiss,
}) => {
  const { t } = useTranslation();

  return (
    <View>
      {/* Close Button */}
      {onDismiss && (
        <View className="absolute top-0 right-0 z-10">
          <TouchableOpacity
            onPress={onDismiss}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-gray-600 dark:text-gray-300 font-bold text-lg">
              ×
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="w-full h-48 justify-center items-center">
        <Image
          source={image_url ? { uri: image_url } : PLACEHOLDER_PRODUCT_IMAGE}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <Divider className="w-full my-4" />

      <View className="flex-row items-start mb-4">
        <Text className="text-xl font-bold flex-1 mr-3" numberOfLines={2}>
          {title || t('cart_drawer.no_title')}
        </Text>
        {amountUnit && (
          <Text className="text-md text-muted-foreground text-right min-w-fit">
            {amountUnit}
          </Text>
        )}
      </View>
    </View>
  );
};
