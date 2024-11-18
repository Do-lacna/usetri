import React from "react";
import { View } from "react-native";
import DiscountList from "../../components/ui/discount-list";
import { IProduct } from "../../components/ui/product-card-new";
import SearchBar from "../../components/ui/search-bar";
import { products } from "../../test/test-data";
import { searchItems, SearchOptions } from "../../utils/search-utils";

const options: SearchOptions<IProduct> = {
  threshold: 0.7,
  searchFields: ["name", "brand"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<IProduct[]>([]);

  React.useEffect(() => {
    if (searchQuery?.length > 0) {
      setSearchResults(searchItems(products, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  console.log(searchQuery);
  console.log(searchResults);

  return (
    <View className="px-2">
      <SearchBar
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery("")}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={(option) => console.log("Option selected:", option)}
      />
      <DiscountList
        products={products}
        store={{ name: "Tesco", id: "12", image: "12" }}
      />
      <DiscountList
        products={products}
        store={{ name: "Lidl", id: "12", image: "12" }}
      />
    </View>
  );
}
