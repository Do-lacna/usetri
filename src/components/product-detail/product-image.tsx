import type React from 'react';
import { Image, Text, View } from 'react-native';
import { Badge } from '~/src/components/ui/badge';
const PLACEHOLDER_PRODUCT_IMAGE = require('~/assets/images/product_placeholder.jpg');

interface ProductImageProps {
  imageUrl?: string | null;
  discountPercentage?: number | null;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  discountPercentage,
}) => {
  return (
    <View className="items-center justify-center py-2 relative">
      <Image
        source={imageUrl ? { uri: imageUrl } : PLACEHOLDER_PRODUCT_IMAGE}
        className="w-full h-60"
        resizeMode="contain"
      />
      {discountPercentage && (
        <Badge className="absolute top-6 left-4 bg-discount">
          <Text className="text-sm text-discount-foreground font-semibold">
            -{discountPercentage}%
          </Text>
        </Badge>
      )}
    </View>
  );
};
