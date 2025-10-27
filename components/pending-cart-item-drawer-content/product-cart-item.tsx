import { AlertCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import type { PendingCartDataType } from '~/app/(app)/main/(tabs)/shopping-list';
import { isArrayNotEmpty } from '~/lib/utils';
import { useGetHybridCart } from '~/network/hybrid-cart/hybrid-cart';
import type { ShopPriceDto } from '~/network/model';
import { useGetProductsByBarcode } from '~/network/query/query';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';
import { Button } from '../ui/button';
import Counter from '../ui/counter';
import { Text } from '../ui/text';
import { CartItemHeader } from './cart-item-header';

export enum PendingCartItemActionEnum {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

interface ProductCartItemProps {
  pendingCartData: PendingCartDataType;
  onDismiss: () => void;
  onConfirm: (
    pendingCartData?: PendingCartDataType,
    quantity?: number,
    action?: PendingCartItemActionEnum,
  ) => void;
  isLoading?: boolean;
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({
  pendingCartData,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [productCount, setProductCount] = React.useState(1);

  const {
    data: { cart } = {},
    isLoading: isCartLoading,
  } = useGetHybridCart();

  const { data: productData, isLoading: areProductsLoading } =
    useGetProductsByBarcode(String(pendingCartData?.identifier));

  const isLoadingGlobal = isLoading || areProductsLoading;

  const itemInCartCount =
    cart?.specific_products?.find(
      ({ product: { barcode } = {} }) =>
        barcode === pendingCartData?.identifier,
    )?.quantity ?? 0;

  useEffect(() => {
    if (itemInCartCount > 0) {
      setProductCount(itemInCartCount);
    } else {
      setProductCount(1);
    }
  }, [itemInCartCount]);

  const {
    detail: {
      name = '',
      brand = '',
      image_url,
      unit: { normalized_amount: amount = '', normalized_unit: unit = '' } = {},
      category: { image_url: categoryImageUrl } = {},
    } = {},
    shops_prices,
  } = productData ?? {};

  const itemDetail = {
    title: `${brand} ${name}`,
    image_url: image_url ?? categoryImageUrl,
    amount: `${amount} ${unit}`,
    price: shops_prices?.[0]?.price ?? 0,
    shops_prices: shops_prices ?? [],
  };

  const handleConfirm = (count: number) => {
    onConfirm(
      pendingCartData,
      count,
      itemInCartCount > 0
        ? PendingCartItemActionEnum.UPDATE
        : PendingCartItemActionEnum.ADD,
    );
  };

  return (
    <View className="flex flex-col justify-between w-full p-4 bg-background">
      <View>
        <CartItemHeader
          image_url={itemDetail.image_url}
          title={itemDetail.title}
          amountUnit={itemDetail.amount}
          onDismiss={onDismiss}
        />

        {/* Shop Availability Section */}
        {isArrayNotEmpty(itemDetail.shops_prices) && (
          <View className="mb-2">
            <Text className="text-sm text-muted-foreground mb-2">
              {t('cart_drawer.available_in')}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {itemDetail.shops_prices?.map(
                ({ shop_id, price }: ShopPriceDto, index: number) => {
                  // TODO: Replace with actual availability flag from BE when available
                  // For now, simulate: make every 3rd item unavailable for testing
                  const isAvailable = index % 3 !== 1;

                  return shop_id ? (
                    <View
                      key={shop_id}
                      className={`flex-row items-center rounded-lg px-2 py-1 ${
                        isAvailable
                          ? 'bg-muted border border-border'
                          : 'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50'
                      }`}
                    >
                      <ShopLogoBadge shopId={shop_id} size={24} />
                      {price && (
                        <Text
                          className={`text-xs ml-1 font-medium ${
                            isAvailable
                              ? 'text-muted-foreground'
                              : 'text-yellow-700 dark:text-yellow-500'
                          }`}
                        >
                          {price.toFixed(2)}€
                        </Text>
                      )}
                      {!isAvailable && (
                        <AlertCircle
                          size={12}
                          color="#EAB308"
                          className="ml-1"
                        />
                      )}
                    </View>
                  ) : null;
                },
              )}
            </View>

            {/* Warning message if any shop has unavailable product */}
            {itemDetail.shops_prices?.some(
              (_, index) => index % 3 === 1, // TODO: Replace with actual availability check
            ) && (
              <View className="flex-row items-center mt-3 px-3 py-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 rounded-lg">
                <AlertCircle
                  size={16}
                  color="#EAB308"
                  className="mr-2 flex-shrink-0"
                />
                <Text className="text-xs font-medium text-yellow-700 dark:text-yellow-400 flex-1">
                  {t('product.may_not_be_available')}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Actions Section - Wolt Style */}
      <View className="w-full flex-row gap-4 items-center justify-between my-6">
        {/* Counter on the left */}
        <Counter initialCount={productCount} onCountChange={setProductCount} />

        {/* Confirm button on the right */}
        <Button
          onPress={() => handleConfirm(productCount)}
          className="flex-1 flex-row ml-4 px-2 justify-between"
          disabled={isLoadingGlobal}
        >
          <Text>{t('cart_drawer.add_to_cart')}</Text>
          <Text>{((itemDetail.price ?? 0) * productCount)?.toFixed(2)}€</Text>
        </Button>
      </View>
    </View>
  );
};
