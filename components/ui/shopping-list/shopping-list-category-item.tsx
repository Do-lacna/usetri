import { Minus, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../../lib/constants";
import { useGetHybridCart } from "../../../network/hybrid-cart/hybrid-cart";
import { CartCategoryDto } from "../../../network/model";
import { useGetProducts } from "../../../network/query/query";
import SuggestedProductCard from "../suggested-product-card";

const ShoppingListCategoryItem: React.FC<{
  item: CartCategoryDto;
  onUpdateQuantity: (categoryId: number, quantity: number) => void;
  onAlternativeSelect: (barcode: string, categoryId: number) => void;
  isExpanded?: boolean;
}> = ({
  item,
  onUpdateQuantity,
  onAlternativeSelect,
  isExpanded: externalIsExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    category: { id, name, image_url, parent_id } = {},
    quantity = 1,
    price = 0,
    available_shop_ids = [],
  } = item;

  const { data: { cart } = {} } = ({} = useGetHybridCart());

  const { data: { products: suggestedProducts = [] } = {}, isLoading } =
    useGetProducts(
      {
        category_id: id,
      },
      { query: { enabled: !!id && isExpanded } }
    );

  useEffect(() => {
    if (externalIsExpanded !== undefined) {
      setIsExpanded(externalIsExpanded);
    }
  }, [externalIsExpanded]);

  const incrementQuantity = () => {
    onUpdateQuantity(Number(id), quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity <= 0) return;
    onUpdateQuantity(Number(id), quantity - 1);
  };

  const totalPrice = (price * quantity).toFixed(2);

  const isSelected = (barcode: string): boolean =>
    cart?.specific_products?.some(
      ({ product }) => product?.barcode === barcode
    ) ?? false;

  return (
    <View
      //   style={{ transform: [{ scale: scaleAnim }] }}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <TouchableOpacity
        onPress={() => setIsExpanded((expanded) => !expanded)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center">
            <View className="relative mr-2">
              <Image
                source={{
                  uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
                }}
                className="w-10 h-10 p-1 rounded-lg"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <View className="flex-1 pr-2">
                <Text
                  className="text-gray-900 font-semibold text-base"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-2 items-center">
                  <Text className="text-gray-900 font-bold text-base">
                    {totalPrice}€
                  </Text>
                  {quantity > 1 && (
                    <Text className="text-gray-500 text-xs">
                      ({price.toFixed(2)} € / kus)
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-col items-end">
            <View className="flex-row items-center bg-gray-50 rounded-full">
              <TouchableOpacity
                onPress={decrementQuantity}
                className="p-2"
                disabled={quantity <= 0}
              >
                {quantity <= 1 ? (
                  <Trash2 size={18} color="#ef4444" />
                ) : (
                  <Minus
                    size={16}
                    color={quantity <= 1 ? "#d1d5db" : "#374151"}
                  />
                )}
              </TouchableOpacity>

              <Text className="px-3 py-1 text-gray-900 font-medium min-w-[32px] text-center">
                {item.quantity}
              </Text>

              <TouchableOpacity onPress={incrementQuantity} className="p-2">
                <Plus size={16} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
              {suggestedProducts
                ?.sort(
                  (a, b) =>
                    Number(isSelected(String(b.barcode))) -
                    Number(isSelected(String(a.barcode)))
                )
                ?.map(({ barcode, detail, shops_prices }, index) => (
                  <SuggestedProductCard
                    key={barcode || index}
                    product={{ detail }}
                    shopsPrices={shops_prices}
                    onPress={onAlternativeSelect}
                    isSelected={isSelected(String(barcode))}
                  />
                ))}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListCategoryItem;
