import React from "react";
import { Text, View } from "react-native";
import { CategoryExtendedWithPathDto } from "../../../apicko";
import EmptyShoppingListPlaceholderScreen from "../../../components/placeholders/empty-shopping-list-placeholder-screen";
import SearchBar from "../../../components/ui/search-bar";
import { isArrayNotEmpty } from "../../../lib/utils";
import { useGetCategories } from "../../../network/query/query";
import { searchItems, SearchOptions } from "../../../utils/search-utils";

const options: SearchOptions<CategoryExtendedWithPathDto> = {
  threshold: 0.7,
  searchFields: ["name"],
  matchMode: "all", // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const { data: { data: { categories = [] } = {} } = {} } = useGetCategories();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    CategoryExtendedWithPathDto[]
  >([]);

  React.useEffect(() => {
    if (searchQuery?.length > 0 && isArrayNotEmpty(categories)) {
      setSearchResults(searchItems(categories, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <View className="px-2">
      <SearchBar<CategoryExtendedWithPathDto>
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery("")}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={(option) => console.log("Option selected:", option)}
        renderOption={(item) => (
          <Text className="text-gray-800 text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.id)}
      />
      <EmptyShoppingListPlaceholderScreen />
    </View>
  );
}
