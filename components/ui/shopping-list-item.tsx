import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { Trash2 } from "~/lib/icons/Trash";
import { useGetProducts } from "../../network/query/query";

interface IShoppingListItemProps {
  label: string;
  categoryId: number;
  isExpanded?: boolean;
  onExpandChange?: (isExpanded: boolean) => void;
  onDelete: () => void;
}

const ShoppingListItem = ({
  label,
  categoryId,
  isExpanded: externalIsExpanded,
  onExpandChange,
  onDelete,
}: IShoppingListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: { data = {} } = {}, isLoading } = useGetProducts(
    {
      category_id: categoryId,
    },
    { query: { enabled: !!categoryId } }
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
        <Text className="text-base font-medium text-gray-800">{label}</Text>

        <View className="flex-row items-center">
          <TouchableOpacity onPress={onDelete} className="mr-4 p-2">
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
            <View className="flex-row align-center justify-center space-x-4 w-full h-45">
              {/* {products.map((product, index) => (
              <View 
                key={product.id || index}
                className="mr-4 p-3 bg-gray-50 rounded-lg min-w-[150px]"
              >
                <Text className="font-medium text-gray-800">{product.name}</Text>
                <Text className="text-gray-600">${product.price}</Text>
              </View>
            ))} */}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListItem;
