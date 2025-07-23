import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "~/components/ui/search-bar";
import { ScanBarcode } from "~/lib/icons/ScanBarcode";
import IconButton from "../../../../components/icon-button";
import { CategoriesGrid } from "../../../../components/search/CategoriesGrid";
import { CategoryDetailView } from "../../../../components/search/CategoryDetailView";
import { NoDataText } from "../../../../components/ui/no-data-text/no-data-text";
import DiscountedProductCard from "../../../../components/ui/product-card/discounted-product-card";
import type { PopularCategoryDto, ProductDto } from "../../../../network/model";
import { useGetPopularCategories, useGetProducts } from "../../../../network/query/query";

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<PopularCategoryDto | null>(null);

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
        enabled: searchQuery?.length > 1,
      },
    }
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-2">
        <View className="flex-row items-center gap-4 mt-2 z-10">
          <SearchBar<ProductDto>
            displaySearchOptions={false}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery("")}
            searchText={searchQuery}
            placeholder="Hľadaj produkty"
            options={[]}
            onOptionSelect={(option) => console.log("Option selected:", option)}
            renderOption={(item) => (
              <Text className="text-gray-800 text-lg">{item?.name}</Text>
            )}
            keyExtractor={(item) => String(item.barcode)}
          />

          <IconButton
            onPress={() =>
              router.navigate("/main/barcode-search/barcode-search-screen")
            }
            className="w-10"
          >
            <ScanBarcode size={24} className="text-primary mr-3" />
          </IconButton>
        </View>

        {/* <View className="flex-row gap-1 mt-2 mb-4">
          <Text className="text-lg tracking-wide">Hľadaj v lokalite:</Text>
          <Pressable>
            <Text className="text-lg text-terciary font-bold tracking-wide">
              Bratislava
            </Text>
          </Pressable>
        </View> */}

        {displaySearchResult ? (
          <FlatList
            data={searchProducts}
            renderItem={({ item }) => (
              <DiscountedProductCard
                product={item}
                onPress={handleProductPress}
                shopsPrices={item?.shops_prices || []}
              />
            )}
            numColumns={3}
            keyExtractor={(product) => String(product?.detail?.barcode)}
            contentContainerClassName="gap-4 py-12 px-2"
            columnWrapperClassName="gap-4"
            refreshControl={
              <RefreshControl
                refreshing={areProductsLoading}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              !areProductsLoading ? (
                <ActivityIndicator animating={true} className="mt-12" />
              ) : (
                <View className="flex-1 flex items-center justify-center">
                  <NoDataText className="text-xl my-4">
                    Žiadne výsledky
                  </NoDataText>
                </View>
              )
            }
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
      </View>
    </SafeAreaView>
  );
}
