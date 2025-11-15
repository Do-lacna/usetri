import type React from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Search, X } from 'lucide-react-native';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useColorScheme } from '~/src/lib/useColorScheme';

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

export interface ISearchBarHandle {
  blur: () => void;
  focus: () => void;
}

const SearchBarComponent = <T,>(
  {
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
  }: ISearchBarProps<T>,
  ref: React.Ref<ISearchBarHandle>,
) => {
  const { isDarkColorScheme } = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current?.blur(),
    focus: () => inputRef.current?.focus(),
  }));

  const placeholderColor = isFocused
    ? '#22c55e'
    : isDarkColorScheme
      ? '#a1a1aa'
      : '#6b7280';

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();

    if (displaySearchOptions && searchText.length >= minimumSearchLength) {
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      onBlur?.();

      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, 50);
  };

  const handleClear = () => {
    onClear();
    inputRef.current?.blur();
  };

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
      <View
        className={`bg-card px-4 flex-row items-center justify-center transition-all duration-200 border-2 ${
          showDropdown ? 'rounded-t-xl border-b-0' : 'rounded-xl'
        } ${disabled ? 'opacity-60' : ''} ${
          error
            ? 'border-destructive'
            : isFocused
              ? 'border-primary'
              : 'border-border'
        } ${isFocused ? 'shadow-lg' : 'shadow-sm'}`}
        style={{
          height: Platform.OS === 'ios' ? 48 : 44,
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
            className={isFocused ? 'text-primary' : 'text-muted-foreground'}
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
          className="flex-1 text-foreground text-base"
          autoComplete="off"
          autoCorrect={false}
          editable={!disabled}
          accessibilityLabel={placeholder}
          accessibilityRole="search"
          style={{
            textAlignVertical: 'center',
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: Platform.OS === 'ios' ? 20 : undefined,
            includeFontPadding: false,
            height: '100%',
          }}
        />

        {/* Loading or Clear Button */}
        <View className="ml-3 flex-row items-center">
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={
                isFocused
                  ? '#22c55e'
                  : isDarkColorScheme
                    ? '#a1a1aa'
                    : '#6b7280'
              }
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
          className="absolute top-[56px] left-0 right-0 rounded-b-xl max-h-60 border-t-0 z-20 overflow-hidden bg-card border-2 border-border"
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
                style={{
                  backgroundColor: 'transparent',
                  borderBottomColor:
                    index !== options.length - 1 ? undefined : 'transparent',
                  borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                }}
                className="px-4 py-3 active:bg-muted/30 transition-colors duration-150 border-b border-border"
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

const SearchBar = forwardRef(SearchBarComponent) as <T>(
  props: ISearchBarProps<T> & { ref?: React.Ref<ISearchBarHandle> },
) => React.ReactElement;

export default SearchBar;
