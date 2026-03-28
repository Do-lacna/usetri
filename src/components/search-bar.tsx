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
import { useTranslation } from 'react-i18next';
import { COLORS } from '~/src/lib/constants';

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
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current?.blur(),
    focus: () => inputRef.current?.focus(),
  }));

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
        className={`px-4 flex-row items-center justify-center bg-card ${
          showDropdown ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'
        } ${disabled ? 'opacity-50' : ''} border-2 ${
          error
            ? 'border-destructive'
            : isFocused
              ? 'border-primary'
              : 'border-v2'
        }`}
        style={{
          height: Platform.OS === 'ios' ? 50 : 46,
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: isFocused ? COLORS.v1 : COLORS.v2,
                shadowOffset: { width: 0, height: isFocused ? 4 : 1 },
                shadowOpacity: isFocused ? 0.28 : 0.18,
                shadowRadius: isFocused ? 10 : 4,
              }
            : {
                elevation: isFocused ? 6 : 1,
              }),
        }}
      >
        <View className="mr-3">
          <Search size={20} color={isFocused ? COLORS.v1 : COLORS.v2} />
        </View>

        <TextInput
          {...props}
          ref={inputRef}
          value={searchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onSearch}
          placeholder={placeholder}
          placeholderTextColor={isFocused ? COLORS.v3 : COLORS.v2}
          className="flex-1 text-foreground text-base font-medium"
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
        <View className="ml-2 flex-row items-center">
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={isFocused ? COLORS.v1 : COLORS.n6}
              className="mr-1"
            />
          )}

          {searchText?.length > 0 && !isLoading && (
            <Pressable
              onPress={handleClear}
              className="p-1.5 rounded-full bg-primary/15 active:bg-primary/25 transition-colors duration-150"
              accessibilityLabel={t('search_bar.clear')}
              accessibilityRole="button"
            >
              <X size={16} color={COLORS.v1} />
            </Pressable>
          )}
        </View>
      </View>

      {error && (
        <Text className="text-destructive text-sm mt-2 px-1 font-medium">
          {error}
        </Text>
      )}

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
                  shadowColor: COLORS.v1,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                }
              : {
                  elevation: 10,
                }),
          }}
          className="absolute top-[58px] left-0 right-0 rounded-b-2xl max-h-60 border-t-0 z-20 overflow-hidden bg-card border-2 border-primary"
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
                  borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                }}
                className="px-4 py-3 active:bg-accent/30 transition-colors duration-150 border-b border-accent"
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
                  <Text className="text-muted-foreground text-base font-medium">
                    {t('search_bar.no_results')}
                  </Text>
                  <Text className="text-muted-foreground/60 text-sm mt-1">
                    {t('search_bar.no_results_hint')}
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
