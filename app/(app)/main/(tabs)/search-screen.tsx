import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestRegistrationOverlay } from '~/src/components/guest-registration-overlay';
import { useSession } from '~/src/context/authentication-context';
import { CategoriesGrid } from '~/src/features/search/components/CategoriesGrid';
import { CategoryDetailView } from '~/src/features/search/components/CategoryDetailView';
import { SearchHeader } from '~/src/features/search/components/SearchHeader';
import { SearchResultsView } from '~/src/features/search/components/SearchResultsView';
import type { PopularCategoryDto } from '~/src/network/model';
import {
  useGetPopularCategories,
  useGetProducts,
} from '~/src/network/query/query';

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const { isGuest } = useSession();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] =
    React.useState<PopularCategoryDto | null>(null);
  const [showGuestOverlay, setShowGuestOverlay] = useState(false);

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
      is_category_checked: true,
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

  const handleProductPress = (productId: number, categoryId?: number) => {
    if (isGuest) {
      setShowGuestOverlay(true);
      return;
    }
    router.navigate(`/product/${productId}`);
  };

  const handleDismissOverlay = useCallback(() => {
    setShowGuestOverlay(false);
  }, []);

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

      {isGuest && showGuestOverlay && (
        <GuestRegistrationOverlay
          title="Detail produktu"
          description="Pre zobrazenie detailu produktu a porovnania cien sa prosím zaregistrujte alebo prihláste."
          dismissable
          onDismiss={handleDismissOverlay}
        />
      )}
    </SafeAreaView>
  );
}
