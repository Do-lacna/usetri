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
import type { ProductDto, ShopItemDto } from "../../../../network/model";
import { useGetProducts } from "../../../../network/query/query";

const MOCK_CATEGORIES = [
  {
    id: 1428,
    name: "Mliečné nápoje",
    image_url:
      "https://usetristorage.blob.core.windows.net/images/categories/mliecne_vyrobky_vajicka/mlieko-a-mliecne-napoje.png",
    children: [
      {
        id: 1429,
        name: "Mlieko",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/mliecne_vyrobky_vajicka/mlieko.png",
        parent_id: 1428,
        path_from_root: ["Mliečné nápoje", "Mlieko"],
        path_from_root_numeric: [1428, 1429],
      },
      {
        id: 1430,
        name: "Jogurty",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/mliecne_vyrobky_vajicka/jogurt.png",
        parent_id: 1428,
        path_from_root: ["Mliečné nápoje", "Jogurty"],
        path_from_root_numeric: [1428, 1430],
      },
    ],
  },
  {
    id: 30,
    name: "Mrazené výrobky",
    image_url:
      "https://usetristorage.blob.core.windows.net/images/categories/mrazene_vyrobky/mrazena-pizza.png",
    children: [
      {
        id: 31,
        name: "Mrazené pizze",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/mrazene_vyrobky/mrazena-pizza.png",
        parent_id: 30,
        path_from_root: ["Mrazené výrobky", "Mrazené pizze"],
        path_from_root_numeric: [30, 31],
      },
      {
        id: 32,
        name: "Mrazené ovocie a zelenina",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/mrazene_vyrobky/mrazene-ovocie-zelenina.png",
        parent_id: 30,
        path_from_root: ["Mrazené výrobky", "Mrazené ovocie a zelenina"],
        path_from_root_numeric: [30, 32],
      },
    ],
  },
  {
    id: 103,
    name: "Maso a ryby",
    image_url:
      "https://usetristorage.blob.core.windows.net/images/categories/maso_ryby/bravcove.png",
    children: [
      {
        id: 104,
        name: "Bravčové mäso",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/maso_ryby/bravcove.png",
        parent_id: 103,
        path_from_root: ["Maso a ryby", "Bravčové mäso"],
        path_from_root_numeric: [103, 104],
      },
      {
        id: 105,
        name: "Hovädzie mäso",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/maso_ryby/hovadzie.png",
        parent_id: 103,
        path_from_root: ["Maso a ryby", "Hovädzie mäso"],
        path_from_root_numeric: [103, 105],
      },
    ],
  },
  {
    id: 595,
    name: "Nápoje",
    image_url:
      "https://usetristorage.blob.core.windows.net/images/categories/napoje/liehoviny.png",
    children: [
      {
        id: 596,
        name: "Alkoholické nápoje",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/napoje/liehoviny.png",
        parent_id: 595,
        path_from_root: ["Nápoje", "Alkoholické nápoje"],
        path_from_root_numeric: [595, 596],
      },
      {
        id: 597,
        name: "Nealkoholické nápoje",
        image_url:
          "https://usetristorage.blob.core.windows.net/images/categories/napoje/sirupy-a-koncentraty.png",
        parent_id: 595,
        path_from_root: ["Nápoje", "Nealkoholické nápoje"],
        path_from_root_numeric: [595, 597],
      },
    ],
  },
];

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<{
    id: number;
    name: string;
    children?: { id: number; name: string }[];
  } | null>(null);

  const {
    data: { products: searchProducts = [] } = {},
    isLoading: areProductsLoading,
  } = useGetProducts(
    {
      search: searchQuery,
    },
    {
      query: {
        enabled: searchQuery?.length > 2,
      },
    }
  );

  const outputProducts = searchProducts?.map(({ products }) => products?.[0]);

  const displaySearchResult =
    searchQuery?.length > 0 && (outputProducts?.length ?? 0) > 0;

  const isLoading = areProductsLoading;

  const handleCategorySelect = (category: {
    id: number;
    name: string;
    children?: { id: number; name: string }[];
  }) => {
    if (category.id === selectedCategory?.id) {
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

  // Function to get products for a specific subcategory
  const getProductsForSubcategory = (subcategoryId: number) => {
    const {
      data: { products: categoryProducts = [] } = {},
      isLoading: areCategoryProductsLoading,
    } = useGetProducts(
      {
        category_id: subcategoryId,
      },
      {
        query: {
          enabled: !!subcategoryId,
        },
      }
    );

    const outputCategoryProducts: ShopItemDto[] =
      categoryProducts
        ?.map(({ products }) => products?.[0])
        .filter((product): product is ShopItemDto => Boolean(product)) || [];

    return {
      products: outputCategoryProducts,
      isLoading: areCategoryProductsLoading,
    };
  };

  console.log(
    "SearchScreen render - searchQuery:",
    searchQuery,
    "displaySearchResult:",
    displaySearchResult,
    "selectedCategory:",
    selectedCategory?.name
  );

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
            data={outputProducts}
            renderItem={({ item }) => (
              <DiscountedProductCard
                product={item}
                onPress={handleProductPress}
                availableShopIds={[1]}
              />
            )}
            numColumns={3}
            keyExtractor={(product) => String(product?.detail?.barcode)}
            contentContainerClassName="gap-4 p-1"
            columnWrapperClassName="gap-4"
            refreshControl={
              <RefreshControl
                refreshing={areProductsLoading}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              !areProductsLoading ? (
                <ActivityIndicator animating={true} className="mt-10" />
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
            categories={MOCK_CATEGORIES}
            onBack={handleBack}
            onProductPress={handleProductPress}
            onCategorySelect={handleCategorySelect}
          />
        ) : (
          <CategoriesGrid
            categories={MOCK_CATEGORIES}
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
