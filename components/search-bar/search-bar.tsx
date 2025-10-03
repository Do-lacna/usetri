import type React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { X } from '~/lib/icons/Cancel';
import { Search } from '~/lib/icons/Search';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '../ui/text';
import { useState, useEffect, useRef } from 'react';

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
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
}

const SearchBar = <T,>({
  onSearch,
  onClear,
  searchText = '',
  placeholder = 'Hľadať',
  options = [],
  onOptionSelect,
  renderOption,
  keyExtractor,
  minimumSearchLength = 2,
  displaySearchOptions = true,
  isLoading = false,
  disabled = false,
  error,
  onFocus,
  onBlur,
  ...props
}: ISearchBarProps<T>) => {
  const { isDarkColorScheme } = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  // Theme-aware colors
  const placeholderColor = isDarkColorScheme ? '#9CA3AF' : '#6B7280';
  const borderColor = error
    ? '#EF4444'
    : isFocused
      ? 'hsl(var(--primary))'
      : 'hsl(var(--border))';

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();

    // Animate dropdown appearance
    if (displaySearchOptions && searchText.length >= minimumSearchLength) {
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    // Add a small delay to ensure blur is processed correctly
    setTimeout(() => {
      setIsFocused(false);
      onBlur?.();

      // Animate dropdown disappearance
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, 50);
  };

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  // Animate dropdown when options change
  useEffect(() => {
    if (
      displaySearchOptions &&
      isFocused &&
      searchText.length >= minimumSearchLength
    ) {
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [
    options,
    searchText,
    isFocused,
    displaySearchOptions,
    minimumSearchLength,
    dropdownAnimation,
  ]);

  const showDropdown =
    displaySearchOptions &&
    isFocused &&
    searchText.length >= minimumSearchLength;

  return (
    <View className="relative z-10 w-full flex-shrink">
      {/* Main Search Input */}
      <View
        className={`bg-card px-4 py-2 flex-row items-center justify-center min-h-[44px] transition-all duration-200 ${
          showDropdown ? 'rounded-t-xl border-b-0' : 'rounded-xl'
        } ${disabled ? 'opacity-60' : ''} ${
          isFocused ? 'border-2 border-green-500' : 'border-2 border-border'
        }`}
        style={{
          // Platform-specific shadow
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: isFocused ? 4 : 1 },
                shadowOpacity: isFocused ? 0.15 : 0.05,
                shadowRadius: isFocused ? 8 : 2,
              }
            : {
                elevation: isFocused ? 8 : 2,
              }),
        }}
      >
        <View className="mr-3">
          <Search
            size={22}
            className={`transition-colors duration-200 ${
              isFocused ? 'text-green-500' : 'text-muted-foreground'
            }`}
          />
        </View>

        <TextInput
          {...props}
          ref={inputRef}
          value={searchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onSearch}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          className="flex-1 text-foreground text-base leading-normal"
          autoComplete="off"
          autoCorrect={false}
          editable={!disabled}
          accessibilityLabel={placeholder}
          accessibilityRole="search"
        />

        {/* Loading or Clear Button */}
        <View className="ml-3 flex-row items-center">
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={isDarkColorScheme ? '#3B82F6' : '#2563EB'}
              className="mr-2"
            />
          )}

          {searchText?.length > 0 && !isLoading && (
            <Pressable
              onPress={handleClear}
              className="p-1 rounded-full bg-muted/30 active:bg-muted/50 transition-colors duration-150"
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <X size={18} className="text-muted-foreground" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-destructive text-sm mt-2 px-4">{error}</Text>
      )}

      {/* Animated Dropdown */}
      {showDropdown && (
        <Animated.View
          style={{
            opacity: dropdownAnimation,
            transform: [
              {
                scaleY: dropdownAnimation,
              },
            ],
            // Platform-specific shadow for dropdown
            ...(Platform.OS === 'ios'
              ? {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                }
              : {
                  elevation: 8,
                }),
          }}
          className="absolute top-[56px] left-0 right-0 bg-card rounded-b-xl max-h-60 border-2 border-t-0 z-20 overflow-hidden"
          pointerEvents={showDropdown ? 'auto' : 'none'}
        >
          <FlatList
            data={options}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  onOptionSelect?.(item);
                  handleBlur();
                }}
                className={`px-4 py-3 active:bg-muted/30 transition-colors duration-150 ${
                  index !== options.length - 1
                    ? 'border-b border-border/30'
                    : ''
                }`}
                accessibilityRole="button"
              >
                {renderOption?.(item)}
              </TouchableOpacity>
            )}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isLoading && searchText?.length >= minimumSearchLength ? (
                <View className="px-4 py-6 items-center">
                  <Text className="text-muted-foreground text-base">
                    Žiadne výsledky
                  </Text>
                  <Text className="text-muted-foreground/70 text-sm mt-1">
                    Skúste iný vyhľadávací výraz
                  </Text>
                </View>
              ) : null
            }
          />
        </Animated.View>
      )}
    </View>
  );
};

export default SearchBar;
