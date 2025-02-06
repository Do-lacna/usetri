import React from "react";
import { ScrollView, Text, View } from "react-native";
import DiscountList from "~/components/ui/discount-list";
import SearchBar from "~/components/ui/search-bar";
import { type SearchOptions } from "~/utils/search-utils";
import type { ProductDto } from "../../../../network/model";
import { useGetProducts } from "../../../../network/query/query";
import { products } from "../../../../test/test-data";

const options: SearchOptions<ProductDto> = {
  threshold: 0.7,
  searchFields: ["name", "brand"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: searchProducts = [] } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length > 2,
      },
    }
  );

  console.log(searchProducts);

  return (
    <View className="flex justify-start px-2">
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
        keyExtractor={(item) => String(item.id)}
      />
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
    </View>
  );
}
