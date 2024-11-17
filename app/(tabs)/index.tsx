import React from "react";
import { ScrollView, Text, View } from "react-native";
import ProductCardNew, { IProduct } from "../../components/ui/product-card-new";
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
      />
      <View className="flex-row ">
        <Text className="text-3xl">Discounts in</Text>
        <Text className="text-3xl font-semibold text-primary ml-1">Tesco</Text>
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
          {searchResults?.map((product, index) => (
            <ProductCardNew
              key={index}
              product={product}
              onPress={() => {
                console.log("Product selected:", product);
              }}
            />
          ))}
        </ScrollView>
      </View>
      {/* const ProductList = ({ products }) => {
  return (
    <View className="flex-row px-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            onPress={() => {
              // Handle product selection
              console.log("Product selected:", product);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}; */}
    </View>
  );
}
