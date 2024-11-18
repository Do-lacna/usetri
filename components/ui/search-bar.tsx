import React from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { X } from "~/lib/icons/Cancel";
import { Search } from "~/lib/icons/Search";
import { IProduct } from "./product-card-new";

export interface ISearchBarProps {
  onSearch: (searchText: string) => void;
  searchText: string;
  onClear: () => void;
  options: IProduct[];
  onOptionSelect: (option: IProduct) => void;
}

const SearchBar = ({
  onSearch,
  onClear,
  searchText = "",
  options = [],
  onOptionSelect,
}: ISearchBarProps) => {
  const renderOption = ({ item }: { item: IProduct }) => (
    <TouchableOpacity
      onPress={() => onOptionSelect(item)}
      className="px-4 py-4 border-b border-gray-200"
    >
      <Text className="text-gray-800 text-lg">{item?.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="relative z-10">
      <View className="bg-white px-4 py-2 rounded-t-lg shadow-sm flex-row items-center h-16">
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
      {options.length > 0 && (
        <View
          className="absolute top-16 left-0 right-0 bg-white rounded-b-lg shadow-sm max-h-60 border-t border-gray-100"
          style={{
            elevation: 5, // for Android shadow
            shadowColor: "#000", // for iOS shadow
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={({ id }) => id}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
