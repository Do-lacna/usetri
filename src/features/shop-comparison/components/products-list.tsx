import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { CartComparisonDto } from '~/src/network/model';
import { MissingCategoryCard } from './missing-category-card';
import { MissingProductCard } from './missing-product-card';
import { ProductListItem } from './product-list-item';

interface ProductsListProps {
  selectedCart?: CartComparisonDto;
  flippedItems: Set<string>;
  onFlipItem: (productId: string) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  selectedCart,
  flippedItems,
  onFlipItem,
}) => {
  const { t } = useTranslation();
  return (
    <View className="bg-card mt-4 rounded-xl border border-border overflow-hidden">
      <Text className="text-lg font-semibold text-foreground p-4 border-b border-border">
        {t('product-list', {
          count: selectedCart?.specific_products?.length ?? 0,
        })}
      </Text>

      {selectedCart?.specific_products?.map((product, index) => (
        <ProductListItem
          key={product?.detail?.id}
          product={product}
          index={index}
          totalProducts={selectedCart?.specific_products?.length ?? 0}
          isFlipped={flippedItems.has(String(product?.detail?.id))}
          onFlip={() => onFlipItem(String(product?.detail?.id))}
        />
      ))}

      {selectedCart?.missing_products?.map((product, index) => (
        <MissingProductCard
          product={product}
          key={product?.detail?.id}
          index={index}
          totalProducts={selectedCart?.missing_products?.length ?? 0}
        />
      ))}

      {selectedCart?.missing_categories?.map((category, index) => (
        <MissingCategoryCard
          key={category?.id}
          category={category}
          index={index}
          totalItems={selectedCart?.missing_categories?.length ?? 0}
        />
      ))}
    </View>
  );
};
