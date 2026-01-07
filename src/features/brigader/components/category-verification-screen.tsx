import type { Option } from '@rn-primitives/select';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Search, X } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CustomSelect,
  type SelectOptionType,
} from '~/src/components/custom-select/custom-select';
import { Button } from '~/src/components/ui/button';
import { Card } from '~/src/components/ui/card';
import { useColorScheme } from '~/src/lib/useColorScheme';
import {
  getGetProductsAdminQueryKey,
  useGetCategoriesAdmin,
  useGetProductsAdmin,
  usePatchProductAdmin,
} from '~/src/network/admin/admin';
import type { AdminCategoryDto, ShopProductDto } from '~/src/network/model';
import { useGetShops } from '~/src/network/query/query';
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from '~/src/utils/toast-utils';

const PLACEHOLDER_PRODUCT_IMAGE = require('~/assets/images/product_placeholder.jpg');
const PAGE_SIZE = 20;
const CATEGORIES_PAGE_SIZE = 50;

cssInterop(Image, { className: 'style' });

interface CategoryProductItemProps {
  product: ShopProductDto;
  onVerify: () => void;
  onChangeCategory: () => void;
  isVerifying: boolean;
}

const CategoryProductItem: React.FC<CategoryProductItemProps> = ({
  product,
  onVerify,
  onChangeCategory,
  isVerifying,
}) => {
  const { detail } = product;
  const imageUrl = detail?.image_url;
  const categoryName = detail?.category?.name || 'Bez kategórie';

  return (
    <Card className="p-4 mb-3 bg-card">
      <View className="flex-row">
        <Image
          source={imageUrl ? { uri: imageUrl } : PLACEHOLDER_PRODUCT_IMAGE}
          className="w-20 h-20 rounded-lg mr-3"
          contentFit="contain"
        />
        <View className="flex-1">
          <Text
            className="text-card-foreground font-semibold text-base"
            numberOfLines={2}
          >
            {detail?.name || 'Neznámy produkt'}
          </Text>
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            {detail?.brand}
          </Text>
          <View className="mt-1 bg-secondary/50 px-2 py-1 rounded self-start">
            <Text className="text-secondary-foreground text-xs font-medium">
              {categoryName}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mt-3">
        <Button
          variant="default"
          className="flex-1"
          onPress={onVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-primary-foreground font-medium">
              Potvrdiť kategóriu
            </Text>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onPress={onChangeCategory}
          disabled={isVerifying}
        >
          <Text className="text-foreground font-medium">Zmeniť kategóriu</Text>
        </Button>
      </View>
    </Card>
  );
};

interface CategorySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: number) => void;
  currentCategoryName?: string;
}

const CategorySelectorModal: React.FC<CategorySelectorModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
  currentCategoryName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { isDarkColorScheme } = useColorScheme();

  // Colors based on color scheme
  const foregroundColor = isDarkColorScheme ? '#fafafa' : '#09090b';
  const mutedForegroundColor = isDarkColorScheme ? '#a1a1aa' : '#71717a';

  // Debounce search query
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    // Simple debounce using setTimeout
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(text);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const {
    data: { all_categories = [] } = {},
    isLoading: areCategoriesLoading,
    isFetching: isFetchingCategories,
  } = useGetCategoriesAdmin(
    {
      category_name: debouncedQuery || undefined,
      Limit: CATEGORIES_PAGE_SIZE,
      Offset: 0,
    },
    {
      query: {
        enabled: visible,
      },
    },
  );

  const renderCategoryItem = ({ item }: { item: AdminCategoryDto }) => {
    const category = item.category;
    const pathDisplay = category?.path_from_root?.join(' > ') || category?.name;

    return (
      <TouchableOpacity
        onPress={() => {
          if (category?.id) {
            onSelectCategory(category.id);
          }
        }}
        className="py-3 px-4 border-b border-border"
      >
        <Text className="text-foreground font-medium" numberOfLines={1}>
          {category?.name}
        </Text>
        {pathDisplay && pathDisplay !== category?.name && (
          <Text
            className="text-muted-foreground text-xs mt-1"
            numberOfLines={1}
          >
            {pathDisplay}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
          <Text className="text-foreground font-semibold text-lg">
            Vybrať kategóriu
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} color={foregroundColor} />
          </TouchableOpacity>
        </View>

        {/* Current category info */}
        {currentCategoryName && (
          <View className="px-4 py-2 bg-muted">
            <Text className="text-muted-foreground text-sm">
              Aktuálna kategória:{' '}
              <Text className="font-medium">{currentCategoryName}</Text>
            </Text>
          </View>
        )}

        {/* Search input */}
        <View className="px-4 py-3">
          <View className="flex-row items-center bg-muted rounded-lg px-3 py-2">
            <Search size={20} color={mutedForegroundColor} />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="Hľadať kategóriu..."
              placeholderTextColor={mutedForegroundColor}
              className="flex-1 ml-2 text-foreground"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                }}
              >
                <X size={18} color={mutedForegroundColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories list */}
        {areCategoriesLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={all_categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => String(item.category?.id)}
            contentContainerClassName="pb-10"
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-muted-foreground text-center">
                  Žiadne kategórie neboli nájdené
                </Text>
              </View>
            }
            ListHeaderComponent={
              isFetchingCategories && !areCategoriesLoading ? (
                <View className="py-2 items-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const CategoryVerificationScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedShop, setSelectedShop] = useState<Option | null>(null);
  const [verifyingProductId, setVerifyingProductId] = useState<number | null>(
    null,
  );
  const [offset, setOffset] = useState(0);
  const [allProducts, setAllProducts] = useState<ShopProductDto[]>([]);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousDataRef = useRef<string | null>(null);

  // Category selector modal state
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [
    selectedProductForCategoryChange,
    setSelectedProductForCategoryChange,
  ] = useState<ShopProductDto | null>(null);

  const {
    data: { shops = [] } = {},
    isPending: areShopsLoading,
  } = useGetShops();

  const mappedShops = useMemo(
    () =>
      shops?.map(shop => ({
        label: shop?.name,
        value: String(shop?.id),
        icon: shop?.image_url,
      })),
    [shops],
  ) as SelectOptionType[];

  const queryParams = useMemo(
    () => ({
      restricted_shops: selectedShop?.value
        ? [Number(selectedShop.value)]
        : undefined,
      is_category_checked: false,
      Limit: PAGE_SIZE,
      Offset: offset,
    }),
    [selectedShop?.value, offset],
  );

  const baseQueryParams = useMemo(
    () => ({
      restricted_shops: selectedShop?.value
        ? [Number(selectedShop.value)]
        : undefined,
      is_category_checked: false,
      Limit: PAGE_SIZE,
      Offset: 0,
    }),
    [selectedShop?.value],
  );

  const {
    data,
    isLoading: areProductsLoading,
    isFetching,
    refetch,
  } = useGetProductsAdmin(queryParams, {
    query: {
      enabled: !!selectedShop?.value,
    },
  });

  const products = data?.products;
  const count = data?.count ?? 0;

  // Update allProducts when new data comes in
  useEffect(() => {
    // Create a stable key from the data to prevent unnecessary updates
    const dataKey = products
      ? JSON.stringify(products.map(p => p.detail?.id))
      : 'empty';

    // Skip if data hasn't actually changed
    if (dataKey === previousDataRef.current) {
      return;
    }
    previousDataRef.current = dataKey;

    const productsList = products ?? [];
    if (productsList.length > 0) {
      if (offset === 0) {
        setAllProducts(productsList);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.detail?.id));
          const newProducts = productsList.filter(
            p => !existingIds.has(p.detail?.id),
          );
          return [...prev, ...newProducts];
        });
      }
      setHasMoreProducts(productsList.length === PAGE_SIZE);
      setIsLoadingMore(false);
    } else if (offset === 0 && dataKey === 'empty') {
      setAllProducts([]);
      setHasMoreProducts(false);
      setIsLoadingMore(false);
    }
  }, [products, offset]);

  // Reset when shop changes
  const handleShopChange = useCallback((shop: Option) => {
    setSelectedShop(shop);
    setOffset(0);
    setAllProducts([]);
    setHasMoreProducts(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreProducts && !isFetching) {
      setIsLoadingMore(true);
      setOffset(prev => prev + PAGE_SIZE);
    }
  }, [isLoadingMore, hasMoreProducts, isFetching]);

  const handleRefresh = useCallback(() => {
    setOffset(0);
    setAllProducts([]);
    setHasMoreProducts(true);
    refetch();
  }, [refetch]);

  const { mutate: patchProduct } = usePatchProductAdmin({
    mutation: {
      onSuccess: () => {
        displaySuccessToastMessage('Kategória bola úspešne aktualizovaná');
        // Remove the product from the list
        setAllProducts(prev =>
          prev.filter(p => p.detail?.id !== verifyingProductId),
        );
        queryClient.invalidateQueries({
          queryKey: getGetProductsAdminQueryKey(baseQueryParams),
        });
        setVerifyingProductId(null);
        setCategoryModalVisible(false);
        setSelectedProductForCategoryChange(null);
      },
      onError: () => {
        displayErrorToastMessage('Nepodarilo sa aktualizovať kategóriu');
        setVerifyingProductId(null);
      },
    },
  });

  const handleVerifyCategory = (productId: number, categoryId: number) => {
    setVerifyingProductId(productId);
    patchProduct({
      productId,
      data: {
        category_id: categoryId,
        is_category_checked: true,
      },
    });
  };

  const handleChangeCategory = (product: ShopProductDto) => {
    setSelectedProductForCategoryChange(product);
    setCategoryModalVisible(true);
  };

  const handleCategorySelected = (categoryId: number) => {
    if (selectedProductForCategoryChange?.detail?.id) {
      setVerifyingProductId(selectedProductForCategoryChange.detail.id);
      patchProduct({
        productId: selectedProductForCategoryChange.detail.id,
        data: {
          category_id: categoryId,
          is_category_checked: true,
        },
      });
    }
  };

  const isLoading = areShopsLoading || (areProductsLoading && offset === 0);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 px-2" edges={['bottom']}>
      <CustomSelect
        label="Vyberte obchod"
        options={mappedShops}
        defaultValue={undefined}
        onChange={handleShopChange}
        selectClassName="w-full my-4"
      />

      {!selectedShop?.value ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground text-center">
            Vyberte obchod pre zobrazenie produktov
          </Text>
        </View>
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-foreground font-semibold">
              Produkty na overenie: {count}
            </Text>
          </View>

          <FlatList
            data={allProducts}
            renderItem={({ item }) => (
              <CategoryProductItem
                product={item}
                onVerify={() =>
                  handleVerifyCategory(
                    Number(item.detail?.id),
                    Number(item.detail?.category?.id),
                  )
                }
                onChangeCategory={() => handleChangeCategory(item)}
                isVerifying={verifyingProductId === item.detail?.id}
              />
            )}
            keyExtractor={item => String(item.detail?.id)}
            contentContainerClassName="pb-40"
            refreshControl={
              <RefreshControl
                refreshing={isFetching && offset === 0}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-muted-foreground text-center">
                  Žiadne produkty na overenie kategórie
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Category Selector Modal */}
      <CategorySelectorModal
        visible={categoryModalVisible}
        onClose={() => {
          setCategoryModalVisible(false);
          setSelectedProductForCategoryChange(null);
        }}
        onSelectCategory={handleCategorySelected}
        currentCategoryName={
          selectedProductForCategoryChange?.detail?.category?.name ?? undefined
        }
      />
    </SafeAreaView>
  );
};

export default CategoryVerificationScreen;
