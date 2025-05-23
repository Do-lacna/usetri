import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ShopExtendedDto } from "../../network/model";
import { useGetDiscounts } from "../../network/query/query";
import ProductCardNew2 from "./product-card/product-card";
import { Skeleton } from "./skeleton";

export interface IDiscountListProps {
  shop: ShopExtendedDto;
}

const DiscountList = ({ shop }: IDiscountListProps) => {
  const { id, name } = shop;
  const { data: { products } = {}, isPending } = useGetDiscounts(
    { shop_id: id },
    { query: { enabled: !!id } }
  );

  return (
    <View>
      <View className="flex-row mt-4">
        <Text className="text-3xl">Zľavy v</Text>
        <Text className="text-3xl font-semibold text-primary ml-1">{name}</Text>
      </View>
      <View className="flex-row px-4">
        {isPending && (
          <View className="mt-4 gap-4 flex-row items-center justify-between w-full">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="w-32 h-28 bg-divider p-4" />
            ))}
          </View>
        )}
        {products?.length === 0 && !isPending ? (
          <Text className="text-gray-500 text-base mt-2" numberOfLines={2}>
            Tento obchod momentálne neponúka žiadne zľavnené produkty
          </Text>
        ) : (
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
              <ProductCardNew2
                key={index}
                product={product}
                onPress={(id) => router.navigate(`/product/${id}`)}
                availableShopIds={[index + 1]}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default DiscountList;
