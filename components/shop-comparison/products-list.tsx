import React from 'react';
import { Text, View } from 'react-native';
import { HybridCartComparisonDto } from '~/network/model';
import { MissingProductCard } from './missing-product-card';
import { ProductListItem } from './product-list-item';

interface ProductsListProps {
  selectedCart?: HybridCartComparisonDto;
  flippedItems: Set<string>;
  onFlipItem: (barcode: string) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  selectedCart,
  flippedItems,
  onFlipItem,
}) => {
  return (
    <View className="bg-white mt-4 rounded-xl border border-gray-200 overflow-hidden">
      <Text className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
        Váš nákup ({selectedCart?.specific_products?.length ?? 0} kusov)
      </Text>

      {selectedCart?.specific_products?.map((product, index) => (
        <ProductListItem
          key={product?.detail?.barcode}
          product={product}
          index={index}
          totalProducts={selectedCart?.specific_products?.length ?? 0}
          isFlipped={flippedItems.has(String(product?.detail?.barcode))}
          onFlip={() => onFlipItem(String(product?.detail?.barcode))}
        />
      ))}

      {selectedCart?.missing_products?.map((product, index) => (
        <MissingProductCard
          product={product}
          key={product?.detail?.barcode}
          index={index}
          totalProducts={selectedCart?.missing_products?.length ?? 0}
          // shopName="Target" // Optional
        />
      ))}

      {selectedCart?.missing_categories?.map((category, index) => (
        <MissingProductCard
          key={category?.id}
          category={category}
          index={index}
          totalItems={selectedCart?.missing_categories?.length ?? 0}
        />
      ))}
    </View>
  );
};
