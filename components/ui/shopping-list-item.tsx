import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { Trash2 } from "~/lib/icons/Trash";
import { BASE_API_URL } from "../../lib/constants";
import { useGetProducts } from "../../network/query/query";
import ProductCardNew from "./product-card-new";

interface IShoppingListItemProps {
  label: string | null;
  id?: number | string;
  imageUrl?: string | null;
  categoryId?: number;
  isExpanded?: boolean;
  onProductSelect?: (barcode: string, categoryId: number) => void;
  onExpandChange?: (isExpanded: boolean) => void;
  onDelete: (id?: number | string) => void;
}

const ShoppingListItem = ({
  label,
  id,
  imageUrl,
  categoryId,
  isExpanded: externalIsExpanded,
  onProductSelect,
  onExpandChange,
  onDelete,
}: IShoppingListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: { products: suggestedProducts = [] } = {}, isLoading } =
    useGetProducts(
      {
        category_id: categoryId,
      },
      { query: { enabled: !!categoryId && isExpanded } }
    );

  useEffect(() => {
    if (externalIsExpanded !== undefined) {
      setIsExpanded(externalIsExpanded);
    }
  }, [externalIsExpanded]);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandChange) {
      onExpandChange(newExpandedState);
    }
  };

  return (
    <View className="w-full bg-white rounded-lg shadow-sm mb-2">
      {/* Header Row */}
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 border-b border-gray-200"
        onPress={handleToggle}
      >
        {!!imageUrl && (
          <Image
            source={{ uri: `${BASE_API_URL}/${imageUrl}` }}
            resizeMode="contain"
            className="w-8 h-8 mr-4"
            // style={{ width: 20, height: 20 }}
          />
        )}
        <Text className="text-base font-medium text-gray-800">{label}</Text>

        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => onDelete(id)} className="mr-4 p-2">
            <Trash2 className="text-red-500" size={20} />
          </TouchableOpacity>

          <TouchableOpacity className="p-2" onPress={handleToggle}>
            {isExpanded ? (
              <ChevronUp className="text-gray-600" size={20} />
            ) : (
              <ChevronDown className="text-gray-600" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Expandable Content */}
      {isExpanded &&
        (isLoading ? (
          <View className="h-20 justify-center items-center">
            <ActivityIndicator color="#1F2937" />
          </View>
        ) : (
          <ScrollView
            horizontal
            className="p-4"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row align-center justify-center space-x-4 w-full h-45 gap-4">
              {/* {products.map((product, index) => (
              <View 
                key={product.id || index}
                className="mr-4 p-3 bg-gray-50 rounded-lg min-w-[150px]"
              >
                <Text className="font-medium text-gray-800">{product.name}</Text>
                <Text className="text-gray-600">${product.price}</Text>
              </View>
            ))} */}
              {suggestedProducts?.map(
                (
                  { barcode, products = [], available_shop_ids = [] },
                  index
                ) => (
                  <ProductCardNew
                    key={barcode || index}
                    product={products?.[0]}
                    availableShopIds={available_shop_ids}
                    onPress={onProductSelect}
                  />
                )
              )}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListItem;
