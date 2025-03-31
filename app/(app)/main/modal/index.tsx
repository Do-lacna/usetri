import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ComparisonShopReceipt from "../../../../components/ui/carts-comparison/comparison-shop-receipt";
import { getSimplifiedCart } from "../../../../lib/utils";
import { useGetCart } from "../../../../network/customer/customer";
import { useGetCartComparison } from "../../../../network/query/query";

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
      {carts?.map((_, index) => (
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

  if (!carts?.length) {
    return (
      <View className="flex-1 justify-center align-center">
        <Text className="text-xl font-bold text-center">
          No carts to compare
        </Text>
      </View>
    );
  }

  if (carts.length === 1) {
    const cartData = carts?.[0];
    return (
      <View className="flex flex-1 align-center justify-center py-8 px-2">
        <ComparisonShopReceipt {...cartData} />
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
        renderItem={({ item }) => <ComparisonShopReceipt {...item} />}
      />

      {renderPaginationDots()}
    </View>
  );
};

export default GroceryPriceComparisonScreen;
