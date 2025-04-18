import { BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DiscountList from "~/components/ui/discount-list";
import SearchBar from "~/components/ui/search-bar";
import { ScanBarcode } from "~/lib/icons/ScanBarcode";
import { type SearchOptions } from "~/utils/search-utils";
import IconButton from "../../../../components/icon-button";
import BrigaderCameraView from "../../../../components/ui/brigader-camera-view/brigader-camera-view";
import ProductCardNew2 from "../../../../components/ui/product-card/product-card";
import type { ProductDto } from "../../../../network/model";
import { useGetProducts } from "../../../../network/query/query";
import { products } from "../../../../test/test-data";
import { displaySuccessToastMessage } from "../../../../utils/toast-utils";

const options: SearchOptions<ProductDto> = {
  threshold: 0.7,
  searchFields: ["name", "brand"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function SearchScreen() {
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

  const handleBarcodeScanned = (data: BarcodeScanningResult) => {
    router.navigate(`/product/${data?.data}`);
    setIsCameraView(false);
    displaySuccessToastMessage(`Barcode scanned - ${data?.data}`);
  };

  if (isCameraView) {
    return <BrigaderCameraView onBarcodeScanned={handleBarcodeScanned} />;
  }

  return (
    <SafeAreaView className="flex justify-start px-2">
      <View className="flex-row items-center gap-4 mt-2 z-10">
        <SearchBar<ProductDto>
          displaySearchOptions={false}
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
          onPress={() =>
            router.navigate("/main/barcode-search/barcode-search-screen")
          }
          className="w-10"
        >
          <ScanBarcode size={24} className="text-primary mr-3" />
        </IconButton>
      </View>

      <View className="flex-row gap-1 mt-2">
        <Text className="text-lg tracking-wide">Hľadaj v lokalite:</Text>
        <Pressable>
          <Text className="text-lg text-terciary font-bold tracking-wide">
            Bratislava
          </Text>
        </Pressable>
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
    </SafeAreaView>
  );
}
