import type { Option } from '@rn-primitives/select';
import { useQueryClient } from '@tanstack/react-query';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CustomSelect,
  type SelectOptionType,
} from '~/src/components/custom-select/custom-select';
import ShopLogoBadge from '~/src/components/shop-logo-badge/shop-logo-badge';
import { Button } from '~/src/components/ui/button';
import { Card } from '~/src/components/ui/card';
import { PLACEHOLDER_PRODUCT_IMAGE } from '~/src/lib/constants';
import { useAddOrChangePrice } from '~/src/network/admin/admin';
import {
  useGetDiscountPriceImports,
  usePatchDiscountImportEntry,
} from '~/src/network/imports/imports';
import type {
  AddOrChangePriceRequest,
  DiscountPriceImportEntryDto,
  ShopItemDto,
} from '~/src/network/model';
import { DiscountImportActionEnum } from '~/src/network/model';

cssInterop(Image, { className: 'style' });
import { useGetProducts, useGetShops } from '~/src/network/query/query';
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from '~/src/utils/toast-utils';

interface DiscountItemProps {
  discount: DiscountPriceImportEntryDto;
  shopId: number;
  batchId: number;
  location: string | null;
  validFrom?: string;
  validTo?: string;
  onConfirm: () => void;
}

const DiscountItem: React.FC<DiscountItemProps> = ({
  discount,
  shopId,
  batchId,
  location,
  validFrom,
  validTo,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(discount.title || '');
  const [selectedProduct, setSelectedProduct] = useState<ShopItemDto | null>(
    null,
  );

  const {
    data: { products = [] } = {},
    isLoading: isSearching,
  } = useGetProducts(
    {
      search: searchQuery,
      restricted_shops: [shopId],
    },
    {
      query: {
        enabled: isExpanded && !!searchQuery,
      },
    },
  );

  const { mutate: patchDiscountEntry, isPending: isPatchingDiscount } =
    usePatchDiscountImportEntry({
      mutation: {
        onSuccess: () => {
          displaySuccessToastMessage('Zľava bola úspešne potvrdená');
          queryClient.invalidateQueries();
          onConfirm();
        },
        onError: () => {
          displayErrorToastMessage('Nepodarilo sa potvrdiť zľavu');
        },
      },
    });

  const { mutate: updatePrice, isPending: isUpdating } = useAddOrChangePrice({
    mutation: {
      onSuccess: () => {
        displaySuccessToastMessage('Cena produktu bola úspešne aktualizovaná');
        
        // After successful price update, patch the discount entry
        if (discount.discount_id && selectedProduct?.detail?.id) {
          patchDiscountEntry({
            batchId: batchId,
            discountId: discount.discount_id,
            data: {
              action: DiscountImportActionEnum.Accept,
              product_id: selectedProduct.detail.id,
              shop_id: shopId,
            },
          });
        }
        
        setSelectedProduct(null);
      },
      onError: () => {
        displayErrorToastMessage('Nepodarilo sa aktualizovať cenu produktu');
      },
    },
  });

  const handleSelectProduct = (product: ShopItemDto) => {
    setSelectedProduct(product);
  };

  const handleConfirm = () => {
    if (!selectedProduct?.detail?.id) return;

    const priceData: AddOrChangePriceRequest = {
      shop_id: shopId,
      price: discount.new_discount_price || 0,
      discount_price: discount.percentage_discount
        ? {
            price: discount.new_discount_price || 0,
            percentage_discount: discount.percentage_discount,
            valid_from: validFrom,
            valid_to: validTo,
          }
        : undefined,
      location: location,
    };

    updatePrice({
      productId: selectedProduct.detail.id,
      data: priceData,
    });
  };

  return (
    <Card className="p-4 mb-4 bg-card border border-border">
      {/* Discount Info */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-bold text-foreground flex-1">
            {discount.title}
          </Text>
          <ShopLogoBadge shopId={shopId} size={32} />
        </View>

        <View className="space-y-1">
          {discount.brand && (
            <Text className="text-sm text-muted-foreground">
              Značka: {discount.brand}
            </Text>
          )}
          {discount.description && (
            <Text className="text-sm text-muted-foreground">
              {discount.description}
            </Text>
          )}
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-base font-semibold text-foreground">
              Zľavnená cena: {discount.new_discount_price?.toFixed(2)} €
            </Text>
            {discount.percentage_discount && (
              <View className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs font-bold text-red-600">
                  -{discount.percentage_discount}%
                </Text>
              </View>
            )}
          </View>
          {discount.amount && discount.unit && (
            <Text className="text-sm text-muted-foreground">
              {discount.amount} {discount.unit}
            </Text>
          )}
          {discount.import_state && (
            <Text className="text-xs text-muted-foreground">
              Stav: {discount.import_state}
            </Text>
          )}
        </View>
      </View>

      {/* Action Button - Find Product */}
      {!isExpanded ? (
        <Button onPress={() => setIsExpanded(true)} variant="outline">
          <Text>Nájsť produkt v obchode</Text>
        </Button>
      ) : (
        <>
          {/* Search Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Vyhľadať produkt:
            </Text>
            <View className="border border-border rounded-lg px-3 py-2 bg-background">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Zadajte názov produktu..."
                className="text-sm text-foreground"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Product Search Results */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Nájdené produkty:
            </Text>

            {isSearching ? (
              <ActivityIndicator className="my-4" />
            ) : (products || []).length > 0 ? (
              <ScrollView className="max-h-60">
                {(products || []).map(product => (
                  <Button
                    key={product.detail?.id}
                    variant={
                      selectedProduct?.detail?.id === product.detail?.id
                        ? 'default'
                        : 'outline'
                    }
                    onPress={() => handleSelectProduct(product)}
                    className="mb-2 justify-start p-2"
                  >
                    <View className="flex-row items-center flex-1 gap-3">
                      {/* Product Image */}
                      <Image
                        source={{
                          uri:
                            product.detail?.image_url ||
                            product.detail?.category?.image_url ||
                            PLACEHOLDER_PRODUCT_IMAGE,
                        }}
                        className="w-12 h-12 rounded"
                        contentFit="cover"
                      />
                      
                      <View className="flex-1">
                        <Text
                          className={`text-sm font-medium ${
                            selectedProduct?.detail?.id === product.detail?.id
                              ? 'text-primary-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {product.detail?.name}
                        </Text>
                        {product.detail?.brand && (
                          <Text
                            className={`text-xs ${
                              selectedProduct?.detail?.id === product.detail?.id
                                ? 'text-primary-foreground/80'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {product.detail?.brand} •{' '}
                            {product.detail?.unit?.normalized_amount}{' '}
                            {product.detail?.unit?.normalized_unit}
                          </Text>
                        )}
                      </View>

                      {/* Price */}
                      {product.shops_prices?.[0] && (
                        <View className="items-end">
                          {product.shops_prices[0].discount_price?.price ? (
                            <View>
                              <Text
                                className={`text-sm font-bold ${
                                  selectedProduct?.detail?.id === product.detail?.id
                                    ? 'text-primary-foreground'
                                    : 'text-red-600'
                                }`}
                              >
                                {product.shops_prices[0].discount_price.price.toFixed(2)} €
                              </Text>
                              <Text
                                className={`text-xs line-through ${
                                  selectedProduct?.detail?.id === product.detail?.id
                                    ? 'text-primary-foreground/60'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {product.shops_prices[0].price?.toFixed(2)} €
                              </Text>
                            </View>
                          ) : product.shops_prices[0].price !== undefined ? (
                            <Text
                              className={`text-sm font-bold ${
                                selectedProduct?.detail?.id === product.detail?.id
                                  ? 'text-primary-foreground'
                                  : 'text-foreground'
                              }`}
                            >
                              {product.shops_prices[0].price.toFixed(2)} €
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </Button>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-sm text-muted-foreground italic">
                Žiadne produkty nenájdené
              </Text>
            )}
          </View>

          {/* Confirm Button */}
          {selectedProduct && (
            <Button
              onPress={handleConfirm}
              disabled={isUpdating || isPatchingDiscount}
              className="mt-2"
            >
              {isUpdating || isPatchingDiscount ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Potvrdiť cenu</Text>
              )}
            </Button>
          )}

          {/* Collapse Button */}
          <Button
            onPress={() => {
              setIsExpanded(false);
              setSelectedProduct(null);
            }}
            variant="ghost"
            className="mt-2"
          >
            <Text>Zrušiť</Text>
          </Button>
        </>
      )}
    </Card>
  );
};

export default function DiscountConfirmationScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedBatch, setSelectedBatch] = useState<Option | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const {
    data: { shops = [] } = {},
  } = useGetShops();

  const {
    data: { discount_import_batches = [] } = {},
    isLoading: isBatchesLoading,
  } = useGetDiscountPriceImports();

  const batchOptions: SelectOptionType[] = useMemo(
    () =>
      (discount_import_batches || []).map(batch => {
        const shop = (shops || []).find(s => s.id === batch.shop_id);
        return {
          label: `${batch.location || 'Unknown'} - ${shop?.name || 'Unknown Shop'} (${batch.discount_count || 0} zliav)`,
          value: String(batch.batch_id),
          icon: shop?.image_url || undefined,
        };
      }),
    [discount_import_batches, shops],
  );

  const currentBatch = useMemo(
    () =>
      discount_import_batches?.find(
        b => String(b.batch_id) === selectedBatch?.value,
      ),
    [discount_import_batches, selectedBatch],
  );

  const unresolvedDiscounts = useMemo(
    () => (currentBatch?.discounts || []).filter(d => !d.is_resolved),
    [currentBatch],
  );

  const paginatedDiscounts = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return unresolvedDiscounts.slice(start, start + ITEMS_PER_PAGE);
  }, [unresolvedDiscounts, currentPage]);

  const totalPages = Math.ceil(unresolvedDiscounts.length / ITEMS_PER_PAGE);

  const handleDiscountConfirmed = () => {
    queryClient.invalidateQueries();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isBatchesLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      >
        <View className="py-4">
          <Text className="text-2xl font-bold text-foreground mb-4">
            Potvrdenie zliav
          </Text>

          {/* Batch Selector */}
          <CustomSelect
            label="Vyber import batch"
            options={batchOptions}
            defaultValue={batchOptions[0]}
            onChange={setSelectedBatch}
            selectClassName="w-full mb-6"
          />

          {selectedBatch && currentBatch && (
            <>
              {/* Batch Info */}
              <Card className="p-4 mb-4 bg-card border border-border">
                <Text className="text-lg font-semibold mb-2">
                  Informácie o batchi
                </Text>
                <View className="space-y-1">
                  <Text className="text-sm text-muted-foreground">
                    Lokácia: {currentBatch.location || 'N/A'}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Počet zliav: {currentBatch.discount_count || 0}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Nevyriešené: {unresolvedDiscounts.length}
                  </Text>
                  {currentBatch.valid_from && (
                    <Text className="text-sm text-muted-foreground">
                      Platné od:{' '}
                      {new Date(currentBatch.valid_from).toLocaleDateString()}
                    </Text>
                  )}
                  {currentBatch.valid_to && (
                    <Text className="text-sm text-muted-foreground">
                      Platné do:{' '}
                      {new Date(currentBatch.valid_to).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </Card>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <View className="flex-row justify-between items-center mb-4">
                  <Button
                    variant="outline"
                    onPress={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    <Text>Predošlé</Text>
                  </Button>
                  <Text className="text-sm text-muted-foreground">
                    Strana {currentPage + 1} z {totalPages}
                  </Text>
                  <Button
                    variant="outline"
                    onPress={() =>
                      setCurrentPage(p => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                  >
                    <Text>Ďalšie</Text>
                  </Button>
                </View>
              )}

              {/* Discounts List */}
              {paginatedDiscounts.length > 0 ? (
                paginatedDiscounts.map((discount, index) => (
                  <DiscountItem
                    key={discount.discount_id || index}
                    discount={discount}
                    shopId={currentBatch.shop_id || 0}
                    batchId={currentBatch.batch_id || 0}
                    location={currentBatch.location || null}
                    validFrom={currentBatch.valid_from}
                    validTo={currentBatch.valid_to}
                    onConfirm={handleDiscountConfirmed}
                  />
                ))
              ) : (
                <Card className="p-8 bg-card border border-border">
                  <Text className="text-center text-muted-foreground">
                    Všetky zľavy v tomto batchi boli vyriešené ✓
                  </Text>
                </Card>
              )}
            </>
          )}

          {!selectedBatch && (
            <Card className="p-8 bg-card border border-border">
              <Text className="text-center text-muted-foreground">
                Vyber batch pre pokračovanie
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
