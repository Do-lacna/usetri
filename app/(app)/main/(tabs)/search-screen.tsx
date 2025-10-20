import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesGrid } from '~/components/features/search/CategoriesGrid';
import { CategoryDetailView } from '~/components/features/search/CategoryDetailView';
import { SearchHeader } from '~/components/features/search/SearchHeader';
import { SearchResultsView } from '~/components/features/search/SearchResultsView';
import type { PopularCategoryDto } from '~/network/model';
import { useGetPopularCategories, useGetProducts } from '~/network/query/query';

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] =
    React.useState<PopularCategoryDto | null>(null);

  // Get popular categories from backend
  const {
    data: { categories: popularCategories = [] } = {},
    isLoading: areCategoriesLoading,
  } = useGetPopularCategories();

  const {
    data: { products: searchProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length >= 2,
      },
    },
  );

  const displaySearchResult = searchQuery?.length > 1;

  const isLoading = areProductsLoading || areCategoriesLoading;

  const handleCategorySelect = (category: PopularCategoryDto) => {
    if (category.category?.id === selectedCategory?.category?.id) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleProductPress = (barcode: string, categoryId?: number) => {
    router.navigate(`/product/${barcode}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-2">
      <SearchHeader
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {displaySearchResult ? (
        <SearchResultsView
          products={searchProducts || []}
          isLoading={areProductsLoading}
          onProductPress={handleProductPress}
          onRefresh={handleRefresh}
        />
      ) : selectedCategory ? (
        <CategoryDetailView
          selectedCategory={selectedCategory}
          categories={popularCategories || []}
          onBack={handleBack}
          onProductPress={handleProductPress}
          onCategorySelect={handleCategorySelect}
        />
      ) : (
        <CategoriesGrid
          categories={popularCategories || []}
          onCategorySelect={handleCategorySelect}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}
