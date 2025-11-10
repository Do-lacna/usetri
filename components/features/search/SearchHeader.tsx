import { router } from 'expo-router';
import { Text, View } from 'react-native';
import IconButton from '~/components/icon-button/icon-button';
import SearchBar from '~/components/features/search/Searchbar';
import { ScanBarcode } from '~/lib/icons/ScanBarcode';
import type { ProductDto } from '~/network/model';

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
  return (
    <View className="flex-row items-center gap-4 mt-2 z-10">
      <SearchBar<ProductDto>
        displaySearchOptions={false}
        onSearch={onSearch}
        onClear={onClear}
        searchText={searchQuery}
        placeholder="Hľadaj produkty"
        options={[]}
        onOptionSelect={option => console.log('Option selected:', option)}
        renderOption={item => (
          <Text className="text-foreground text-lg">{item?.name}</Text>
        )}
        keyExtractor={item => String(item.barcode)}
      />

      <IconButton
        onPress={() =>
          router.navigate('/main/barcode-search/barcode-search-screen')
        }
        className="w-10"
      >
        <ScanBarcode size={24} className="text-primary mr-3" />
      </IconButton>
    </View>
  );
};
