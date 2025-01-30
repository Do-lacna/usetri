import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { getSimplifiedCart } from "../../../../lib/utils";
import { useGetCart } from "../../../../network/customer/customer";
import { ShopCart } from "../../../../network/model";
import { useGetCartComparison } from "../../../../network/query/query";

// Mock data for shops and groceries
const mockShops = [
  {
    id: 1,
    name: "Cheapest Market",
    totalPrice: 45.5,
    groceries: [
      { id: 1, name: "Apples", quantity: 2, price: 3.99 },
      { id: 2, name: "Milk", quantity: 1, price: 2.5 },
      { id: 3, name: "Bread", quantity: 1, price: 4.2 },
      { id: 4, name: "Eggs", quantity: 12, price: 5.99 },
      { id: 5, name: "Chicken", quantity: 1, price: 7.8 },
    ],
  },
  {
    id: 2,
    name: "Fresh Mart",
    totalPrice: 48.75,
    groceries: [
      { id: 1, name: "Apples", quantity: 2, price: 4.5 },
      { id: 2, name: "Milk", quantity: 1, price: 3.0 },
      { id: 3, name: "Bread", quantity: 1, price: 4.5 },
      { id: 4, name: "Eggs", quantity: 12, price: 6.5 },
      { id: 5, name: "Chicken", quantity: 1, price: 8.25 },
    ],
  },
  {
    id: 3,
    name: "Grocery World",
    totalPrice: 47.2,
    groceries: [
      { id: 1, name: "Apples", quantity: 2, price: 4.2 },
      { id: 2, name: "Milk", quantity: 1, price: 2.75 },
      { id: 3, name: "Bread", quantity: 1, price: 4.35 },
      { id: 4, name: "Eggs", quantity: 12, price: 6.2 },
      { id: 5, name: "Chicken", quantity: 1, price: 8.0 },
    ],
  },
];

const GroceryPriceComparisonScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const width = Dimensions.get("window").width;
  const h = Dimensions.get("window").height;

  const { data: cartData = {} } = useGetCart({
    query: {
      select(data) {
        return getSimplifiedCart(data.cart);
      },
    },
  });

  //TODO send whole cart as parameter
  const { data: { carts = [] } = {} } = useGetCartComparison(cartData, {
    query: { enabled: Object.keys(cartData).length > 0 },
  });

  const renderPaginationDots = () => (
    <View className="flex-row justify-center items-center mb-8">
      {mockShops.map((_, index) => (
        <View
          key={index}
          className={`w-3 h-3 rounded-full mx-2 ${
            index === currentPage ? "bg-primary" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );

  //TODO maybe check rn-pager-view library for this https://docs.expo.dev/versions/latest/sdk/view-pager/

  const renderShopDetail = ({
    item = {},
  }: CarouselRenderItemInfo<ShopCart>) => {
    const {
      shop: { name: shopName, image_url } = {},
      categories = [],
      specific_products: groceries = [],
      total_price,
    } = item;
    return (
      <View
        className="flex-1 p-4 bg-white rounded-lg shadow-md m-4"
        style={{ width: width - 32 }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">{shopName}</Text>
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold mr-2">
              Total: {total_price?.toFixed(2)} €
            </Text>
            <ChevronRight size={24} color="#888" />
          </View>
        </View>

        <View>
          {categories?.map(({ id, name }) => (
            <View key={id} className="flex-row justify-between mb-2">
              <Text className="text-base">
                {name}
                {/* (x{grocery.quantity}) */}
              </Text>
              <Text className="text-base font-semibold">
                {/* //TODO add price here */}${id?.toFixed(2)}
              </Text>
            </View>
          ))}
          {groceries?.map(({ price, detail: { name, barcode } = {} }) => (
            <View key={barcode} className="flex-row justify-between mb-2">
              <Text className="text-base">
                {name}
                {/* (x{grocery.quantity}) */}
              </Text>
              <Text className="text-base font-semibold">
                {price?.toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (!carts?.length) {
    return (
      <View className="flex-1 justify-center align-center">
        <Text className="text-xl font-bold text-center">
          No carts to compare
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 align-center justify-center">
      <Carousel
        loop
        width={width}
        style={{ flex: 1 }}
        data={carts}
        scrollAnimationDuration={1000}
        mode="parallax"
        onSnapToItem={(index) => setCurrentPage(index)}
        renderItem={renderShopDetail}
      />
      {renderPaginationDots()}
    </View>
  );
};

export default GroceryPriceComparisonScreen;
