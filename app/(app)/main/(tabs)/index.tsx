import { router } from "expo-router";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import DiscountList from "~/components/ui/discount-list";
import SearchBar from "~/components/ui/search-bar";
import { ScanBarcode } from "~/lib/icons/ScanBarcode";
import { type SearchOptions } from "~/utils/search-utils";
import IconButton from "../../../../components/icon-button";
import CameraView from "../../../../components/ui/camera-view/camera-view";
import ProductCardNew2 from "../../../../components/ui/product-card/product-card";
import type { ProductDto } from "../../../../network/model";
import { useGetProducts } from "../../../../network/query/query";
import { products } from "../../../../test/test-data";

const options: SearchOptions<ProductDto> = {
  threshold: 0.7,
  searchFields: ["name", "brand"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const [isCameraView, setIsCameraView] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: { products: searchProducts = [] } = {} } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length > 2,
      },
    }
  );

  const outputProducts = searchProducts?.map(({ products }) => products?.[0]);

  const displaySearchResult =
    searchQuery?.length > 0 && outputProducts?.length > 0;

  return isCameraView ? (
    <CameraView />
  ) : (
    <View className="flex justify-start px-2">
      <View className="flex-row items-center gap-4 mt-2 z-10">
        <SearchBar<ProductDto>
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery("")}
          searchText={searchQuery}
          placeholder="Hľadaj produkty"
          options={[]}
          onOptionSelect={(option) => console.log("Option selected:", option)}
          renderOption={(item) => (
            <Text className="text-gray-800 text-lg">{item?.name}</Text>
          )}
          keyExtractor={(item) => String(item.barcode)}
        />

        <IconButton
          onPress={() => router.navigate(`/(app)/oauthredirect`)}
          className="w-10"
        >
          <ScanBarcode size={24} className="text-primary mr-3" />
        </IconButton>
      </View>

      {displaySearchResult ? (
        <FlatList
          data={outputProducts}
          renderItem={({ item }) => (
            <ProductCardNew2
              product={item}
              onPress={(id) => router.navigate(`/product/${id}`)}
              availableShopIds={[1]}
            />
          )}
          numColumns={3}
          keyExtractor={(product) => String(product?.detail?.barcode)}
          contentContainerClassName="gap-4 p-1"
          columnWrapperClassName="gap-4"
        />
      ) : (
        <ScrollView>
          <DiscountList
            products={products}
            store={{ name: "Tescu", id: "12", image: "12" }}
          />
          <DiscountList
            products={products}
            store={{ name: "Lidli", id: "12", image: "12" }}
          />
          <DiscountList
            products={products}
            store={{ name: "Bille", id: "12", image: "12" }}
          />
        </ScrollView>
      )}
    </View>
  );
}
