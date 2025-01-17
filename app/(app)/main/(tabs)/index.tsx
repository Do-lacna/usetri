import React from 'react';
import { Text, View } from 'react-native';
import DiscountList from '~/components/ui/discount-list';
import SearchBar from '~/components/ui/search-bar';
import { useSession } from '~/context/authentication-context';
import { resetAndRedirect } from '~/utils/navigation-utils';
import { type SearchOptions, searchItems } from '~/utils/search-utils';
import { Button } from '../../../../components/ui/button';
import { isArrayNotEmpty } from '../../../../lib/utils';
import type { ProductDto } from '../../../../network/model';
import {
  useGetCategories,
  useGetProducts,
} from '../../../../network/query/query';
import { products } from '../../../../test/test-data';

const options: SearchOptions<ProductDto> = {
  threshold: 0.7,
  searchFields: ['name', 'brand'],
  matchMode: 'all', // Use 'all' to require all words to match, 'any' for partial matches
};

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ProductDto[]>([]);
  const { signOut } = useSession();
  const {
    data: {
      data: { categories } = {},
    } = {},
  } = useGetCategories();

  const {
    data: {
      data: { products: searchProducts } = {},
    } = {},
  } = useGetProducts({
    search: searchQuery,
  });

  const performSignOut = () => {
    signOut();
    resetAndRedirect('/');
  };

  // console.log(products);

  React.useEffect(() => {
    if (searchQuery?.length > 0 && isArrayNotEmpty(searchProducts)) {
      //TODO quick fix until BE is fixed
      const searchProductsMapped = searchProducts as ProductDto[];
      setSearchResults(searchItems(searchProductsMapped, searchQuery, options));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // console.log(searchQuery);
  // console.log(searchResults);

  return (
    <View className="px-2">
      <Button onPress={performSignOut}>
        <Text>Sign Out</Text>
      </Button>
      <SearchBar<ProductDto>
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        searchText={searchQuery}
        options={searchResults}
        onOptionSelect={(option) => console.log('Option selected:', option)}
        renderOption={(item) => (
          <Text className="text-gray-800 text-lg">{item?.name}</Text>
        )}
        keyExtractor={(item) => String(item.id)}
      />
      <DiscountList
        products={products}
        store={{ name: 'Tesco', id: '12', image: '12' }}
      />
      <DiscountList
        products={products}
        store={{ name: 'Lidl', id: '12', image: '12' }}
      />
    </View>
  );
}
