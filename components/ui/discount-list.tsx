import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { ShopExtendedDto } from "../../network/model";
import { useGetDiscounts, useGetProducts } from "../../network/query/query";
import ProductCardNew2 from "./product-card/product-card";
import { Skeleton } from "./skeleton";

export interface IDiscountListProps {
  shop: ShopExtendedDto;
}

interface SkeletonItem {
  id: number;
}

const DiscountList = ({ shop }: IDiscountListProps) => {
  const queryClient = useQueryClient();
  const { id, name } = shop;
  const { data: { products } = {}, isPending } = useGetDiscounts(
    { restricted_shops: [Number(id)] },
    { query: { enabled: !!id } }
  );

  const { data: { products: prod } = {}, isLoading } = useGetProducts();
  const outputProducts = prod?.map(({ products }) => products?.[0]);

  // Create skeleton data that matches FlatList structure
  const skeletonData: SkeletonItem[] = Array.from(
    { length: 4 },
    (_, index) => ({ id: index })
  );

  const renderSkeletonItem: ListRenderItem<SkeletonItem> = ({
    item,
    index,
  }) => (
    <View className="flex-1 max-w-[50%]">
      <Skeleton className="w-full aspect-[4/3] bg-divider rounded-lg" />
    </View>
  );

  console.log(products);

  const renderProductItem: ListRenderItem<any> = ({ item }) => (
    <ProductCardNew2
      product={item}
      onPress={(id: string | number) => router.navigate(`/product/${id}`)}
      availableShopIds={item?.shop_id ? [item?.shop_id] : []}
    />
  );

  return (
    <View>
      <View className="flex-row px-4">
        {isPending ? (
          <FlatList
            data={skeletonData}
            renderItem={renderSkeletonItem}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="gap-4 p-1"
            columnWrapperClassName="gap-4"
            scrollEnabled={false}
          />
        ) : outputProducts?.length === 0 ? (
          <Text
            className="text-gray-500 text-base text-center mt-2"
            numberOfLines={2}
          >
            Tento obchod momentálne neponúka žiadne zľavnené produkty
          </Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            numColumns={2}
            keyExtractor={(product) => String(product?.detail?.barcode)}
            contentContainerClassName="gap-4 p-1"
            columnWrapperClassName="gap-4"
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => queryClient.invalidateQueries()}
              />
            }
            ListEmptyComponent={
              <Text className="text-gray-500 text-base text-center mt-4">
                Tento obchod momentálne neponúka žiadne zľavnené produkty
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default DiscountList;
