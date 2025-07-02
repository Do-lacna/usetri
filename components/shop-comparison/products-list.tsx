import React from 'react';
import { Text, View } from 'react-native';
import { CartComparisonDto } from '~/network/model';
import { ProductListItem } from './product-list-item';

interface ProductsListProps {
  selectedCart?: CartComparisonDto;
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
    </View>
  );
};