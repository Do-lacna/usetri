import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { X } from "~/lib/icons/Cancel";
import { Search } from "~/lib/icons/Search";

export interface ISearchBarProps {
  onSearch: (searchText: string) => void;
  searchText: string;
  onClear: () => void;
}
const SearchBar = ({ onSearch, onClear, searchText = "" }: ISearchBarProps) => {
  return (
    <View className="bg-white px-4 py-2 rounded-lg shadow-sm flex-row items-center h-16 mb-4">
      <Search size={20} className="text-primary mr-3" />
      <TextInput
        value={searchText}
        onChangeText={onSearch}
        placeholder="Search"
        className="flex-1 text-gray-800 text-xl"
      />
      {searchText?.length > 0 && (
        <Pressable onPress={onClear}>
          <X size={20} className="text-primary" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
