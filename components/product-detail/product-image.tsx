import type React from 'react';
import { Image, Text, View } from 'react-native';
import { Badge } from '~/components/ui/badge';
import { PLACEHOLDER_PRODUCT_IMAGE } from '~/lib/constants';

interface ProductImageProps {
  imageUrl?: string | null
  discountPercentage?: number | null;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  discountPercentage,
}) => {
  return (
    <View className="bg-gray-50 items-center justify-center py-2 relative">
      <Image
        source={{
          uri: imageUrl ?? PLACEHOLDER_PRODUCT_IMAGE,
        }}
        className="w-full h-60"
        resizeMode="contain"
      />
      {discountPercentage && (
        <Badge className="absolute top-6 left-4 bg-red-400">
          <Text className="text-sm text-white font-semibold">
            -{discountPercentage}%
          </Text>
        </Badge>
      )}
    </View>
  );
};