import type React from "react";
import {
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { X } from "~/lib/icons/Cancel";
import { Search } from "~/lib/icons/Search";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "../ui/text";

export interface ISearchBarProps<T> {
  onSearch: (searchText: string) => void;
  searchText: string;
  placeholder?: string;
  onClear: () => void;
  options?: T[];
  onOptionSelect?: (option: T) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  renderOption?: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  minimumSearchLength?: number;
  displaySearchOptions?: boolean;
}

const SearchBar = <T,>({
  onSearch,
  onClear,
  searchText = "",
  placeholder = "Hľadať",
  options = [],
  onOptionSelect,
  renderOption,
  keyExtractor,
  minimumSearchLength = 2,
  displaySearchOptions = true,
  onFocus,
  onBlur,
  ...props
}: ISearchBarProps<T>) => {
  const { isDarkColorScheme } = useColorScheme();

  // Theme-aware placeholder color
  const placeholderColor = isDarkColorScheme ? "#9CA3AF" : "#6B7280";

  return (
    <View className="relative z-10 w-full flex-shrink">
      <View className="bg-card px-4 py-2 rounded-t-lg shadow-md flex-row items-center justify-center h-16 border border-border">
        <Search size={20} className="text-muted-foreground mr-3" />
        <TextInput
          {...props}
          value={searchText}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onSearch}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          className="flex-1 text-foreground text-lg leading-normal"
          autoComplete="off"
          autoCorrect={false}
        />
        {searchText?.length > 0 && (
          <Pressable onPress={onClear}>
            <X size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      {displaySearchOptions && (
        <View
          className={`absolute top-16 left-0 right-0 bg-card rounded-b-lg shadow-sm max-h-60 border-t border-border z-20`}
          style={{
            ...(searchText
              ? {
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }
              : {}),
          }}
        >
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onOptionSelect?.(item)}
                className="px-4 py-4 border-b border-border"
              >
                {renderOption?.(item)}
              </TouchableOpacity>
            )}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searchText?.length >= minimumSearchLength ? (
                <Text className="p-4 text-lg text-muted-foreground">
                  Žiadne výsledky
                </Text>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
