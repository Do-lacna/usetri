import React from "react";
import { ScrollView, Text, View } from "react-native";
import { IStoreDto } from "../../models/store.dto";
import { ShopItemDto } from "../../network/model";
import ProductCardNew from "./product-card-new";

export interface IDiscountListProps {
  products: ShopItemDto[];
  store: IStoreDto;
}

const DiscountList = ({
  products = [],
  store: { name: storeName = "Tesco" } = {} as IStoreDto,
}: IDiscountListProps) => {
  return (
    <View>
      <View className="flex-row mt-4">
        <Text className="text-3xl">Zľavy v</Text>
        <Text className="text-3xl font-semibold text-primary ml-1">
          {storeName}
        </Text>
      </View>
      <View className="flex-row px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12, // This adds 24 pixels of space between items
            paddingVertical: 8,
          }}
          className="flex-row space-x-4"
        >
          {products?.map((product, index) => (
            <ProductCardNew
              key={index}
              product={product}
              onPress={() => {
                console.log("Product selected:", product);
              }}
              availableShopIds={[index + 1]}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default DiscountList;
