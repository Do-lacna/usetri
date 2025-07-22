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
import { CartProductDto } from "../../../network/model";
import { useGetProducts } from "../../../network/query/query";
import { getShopLogo } from "../../../utils/logo-utils";
import SuggestedProductCard from "../suggested-product-card";

const ShoppingListProductItem: React.FC<{
  item: CartProductDto;
  onUpdateQuantity: (barcode: string, quantity: number) => void;
  onAlternativeSelect: (originalBarcode: string, barcode: string) => void;
  isExpanded?: boolean;
}> = ({
  item,
  onUpdateQuantity,
  onAlternativeSelect,
  isExpanded: externalIsExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    product: {
      barcode,
      name = "Specific product",
      amount,
      unit,
      brand,
      category: { id: categoryId } = {},
      image_url,
    } = {},
    quantity = 1,
    price = 0,
    available_shop_ids = [],
  } = item;

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

  const incrementQuantity = () => {
    onUpdateQuantity(String(barcode), quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity <= 0) return;
    onUpdateQuantity(String(barcode), quantity - 1);
  };

  const totalPrice = (price * quantity).toFixed(2);

  const isSelected = (suggestedProductBarcode: string): boolean =>
    suggestedProductBarcode === barcode;

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
                source={{ uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE }}
                className="w-16 h-16 rounded-lg bg-gray-100"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <View className="flex-1 pr-2">
                  <Text
                    className="text-gray-900 font-semibold text-base"
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  <Text className="text-gray-600 text-sm" numberOfLines={1}>
                    {brand} • {amount} {unit}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-2 items-center">
                  <Text className="text-gray-900 font-bold text-lg">
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
            <View className="flex-row items-end mb-2">
              <View className="relative flex-row justify-end gap-x-2 mt-1">
                {available_shop_ids?.map((retailer, index) => (
                  <View
                    key={retailer}
                    style={{ width: 20, height: 20, borderRadius: 50 }}
                    //   className="border-2"
                  >
                    <Image
                      {...getShopLogo(retailer as any)}
                      key={index}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 50,
                        position: "absolute",
                        right: index * 10,
                        zIndex: index + 1,
                        backgroundColor: "white",
                        borderColor: "grey",
                        borderWidth: 1,
                        // borderColor: "grey",
                        // borderWidth: 1,
                        //TODO add here some elevation to visually differentiate the shop logos
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
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
                ?.map(
                  (
                    {
                      barcode: suggestedProductBarcode,
                      products = [],
                      available_shop_ids = [],
                    },
                    index
                  ) => (
                    <SuggestedProductCard
                      key={suggestedProductBarcode || index}
                      product={products?.[0]}
                      availableShopIds={available_shop_ids}
                      onPress={() =>
                        onAlternativeSelect(
                          String(barcode),
                          String(suggestedProductBarcode)
                        )
                      }
                      isSelected={isSelected(String(suggestedProductBarcode))}
                    />
                  )
                )}
            </View>
          </ScrollView>
        ))}
    </View>
  );
};

export default ShoppingListProductItem;
