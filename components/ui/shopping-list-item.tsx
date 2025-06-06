import React, { useEffect, useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { Trash2 } from "~/lib/icons/Trash";
import { BASE_API_URL } from "../../lib/constants";
import { useGetCart } from "../../network/customer/customer";
import { useGetProducts } from "../../network/query/query";

export enum ShoppingListItemTypeEnum {
  CATEGORY = "CATEGORY",
  PRODUCT = "PRODUCT",
}

interface IShoppingListItemProps {
  label: string | null;
  type?: ShoppingListItemTypeEnum;
  description?: string;
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
  type,
  description,
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

  const { data: { cart } = {} } = ({} = useGetCart());

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
    <View
      className={`w-full bg-white rounded-lg shadow-${
        Platform.OS === "android" ? "md" : "sm"
      } mb-4 relative`}
    >
      <View className="w-4 h-4 bg-red absolute top-2 left-2" />
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 border-b border-gray-200 overflow-hidden"
        onPress={handleToggle}
      >
        {/* Displaying "Badge" for products */}
        {type === ShoppingListItemTypeEnum.PRODUCT && (
          <View className="w-2 h-32 bg-terciary absolute top-1 left-2 -rotate-45" />
        )}

        {!!imageUrl && (
          <Image
            source={{ uri: `${BASE_API_URL}/${imageUrl}` }}
            resizeMode="contain"
            className="w-8 h-8 mr-4 rotate"
          />
        )}
        <View>
          <Text className="text-base font-medium text-gray-800">{label}</Text>
          {!!description && (
            <Text className="text-sm font-medium text-gray-600">
              {description}
            </Text>
          )}
        </View>

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

      {/* {isExpanded &&
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
              {suggestedProducts?.map(
                (
                  { barcode, products = [], available_shop_ids = [] },
                  index
                ) => (
                  <ProductCartDetailed
                    key={barcode || index}
                    product={products?.[0]}
                    availableShopIds={available_shop_ids}
                    onPress={onProductSelect}
                    isSelected={cart?.specific_products?.some(
                      ({ barcode: _barcode }) => _barcode === barcode
                    )}
                  />
                )
              )}
            </View>
          </ScrollView>
        ))} */}
    </View>
  );
};

export default ShoppingListItem;
