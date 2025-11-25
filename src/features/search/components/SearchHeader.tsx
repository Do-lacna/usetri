import { router } from "expo-router";
import { useState, useRef } from "react";
import { Text, View } from "react-native";
import SearchBar, { ISearchBarHandle } from "~/src/components/search-bar";
import { ProductDto } from "~/src/network/model";
import IconButton from "~/src/components/icon-button/icon-button";
import { ScanBarcode } from "~/src/lib/icons/ScanBarcode";
import { Button } from "~/src/components/ui/button";

interface SearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const SearchHeader = ({
  searchQuery,
  onSearch,
  onClear,
}: SearchHeaderProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<ISearchBarHandle>(null);

  const handleCancel = () => {
    searchBarRef.current?.blur();
    onClear();
  };

  return (
    <View className="flex-row items-center gap-4 mt-2 z-10">
      <SearchBar<ProductDto>
        ref={searchBarRef}
        displaySearchOptions={false}
        onSearch={onSearch}
        onClear={onClear}
        searchText={searchQuery}
        placeholder="Hľadaj produkty"
        options={[]}
        onOptionSelect={(option) => console.log("Option selected:", option)}
        renderOption={(item) => (
          <Text className="text-foreground text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.barcode)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {isFocused && (
        <Button
          onPress={handleCancel}
          variant="ghost"
          size="sm"
          className="px-3"
        >
          <Text className="text-primary text-base">Zrušiť</Text>
        </Button>
      )       
      // (
      //   <IconButton
      //     onPress={() =>
      //       router.navigate("/main/barcode-search/barcode-search-screen")
      //     }
      //     className="w-10"
      //   >
      //     <ScanBarcode size={24} className="text-primary mr-3" />
      //   </IconButton>
      // )
      }
    </View>
  );
};
