import type React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PendingCartDataType } from '~/app/(app)/main/(tabs)/shopping-list';
import { useGetHybridCart } from '~/network/hybrid-cart/hybrid-cart';
import { useGetCategories, useGetCategoryPrices } from '~/network/query/query';
import ShopLogoBadge from '../shop-logo-badge/shop-logo-badge';
import { Button } from '../ui/button';
import Counter from '../ui/counter';
import { Text } from '../ui/text';
import { CartItemHeader } from './cart-item-header';

interface CategoryCartItemProps {
  pendingCartData: PendingCartDataType;
  onDismiss: () => void;
  onConfirm: (quantity: number) => void;
  isLoading?: boolean;
}

export const CategoryCartItem: React.FC<CategoryCartItemProps> = ({
  pendingCartData,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [categoryCount, setCategoryCount] = useState(1);

  const {
    data: { cart } = {},
    isLoading: isCartLoading,
  } = useGetHybridCart();

  const { data: categoryData, isLoading: areCategoriesLoading } =
    useGetCategories(
      {},
      {
        query: {
          select: data =>
            data?.categories?.find(category => {
              return category?.id === Number(pendingCartData?.identifier);
            }) ?? null,
          enabled: true,
        },
      },
    );

  const itemInCartCount =
    cart?.categories?.find(
      ({ category }) => category?.id === Number(pendingCartData?.identifier),
    )?.quantity ?? 0;

  useEffect(() => {
    if (itemInCartCount > 0) {
      setCategoryCount(itemInCartCount);
    } else {
      setCategoryCount(1);
    }
  }, [itemInCartCount]);

  const isLoadingGlobal = isLoading || areCategoriesLoading;

  const {
    data: { shop_prices } = {},
  } = useGetCategoryPrices(Number(pendingCartData?.identifier));

  const categoryPrices = shop_prices?.map(({ shop_id, price }) => ({
    shop_id,
    price: price?.actual_price ?? 0,
  }));

  return (
    <View className="flex flex-col justify-between w-full p-4 bg-background">
      <View>
        <CartItemHeader
          image_url={categoryData?.image_url}
          title={categoryData?.name}
          amountUnit={null}
          onDismiss={onDismiss}
        />

        {/* Category Info Message */}
        <View className="mb-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-3">
          <Text className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
            {t('cart_drawer.category_info')}
          </Text>
        </View>

        {/* Category Prices in Different Supermarkets */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            {t('cart_drawer.estimated_prices')}
          </Text>
          <View className="bg-muted rounded-xl py-4 px-2 border border-border">
            <View className="flex-row flex-wrap gap-3">
              {categoryPrices?.map(({ shop_id, price }) =>
                shop_id ? (
                  <View
                    key={shop_id}
                    className="flex-row items-center bg-background rounded-lg px-2 py-2 border border-border"
                  >
                    <ShopLogoBadge shopId={shop_id} size={20} />
                    <Text className="text-sm font-medium text-foreground ml-2">
                      {price.toFixed(2)}€
                    </Text>
                  </View>
                ) : null,
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section - Wolt Style */}
      <View className="w-full flex-row gap-4 items-center justify-between mt-6 mb-6">
        {/* Counter on the left */}
        <Counter
          initialCount={categoryCount}
          onCountChange={setCategoryCount}
        />

        {/* Confirm button on the right */}
        <Button
          onPress={() => onConfirm(categoryCount)}
          className="flex-1 ml-4"
          disabled={isLoadingGlobal}
        >
          <Text>{t('cart_drawer.add_category')}</Text>
        </Button>
      </View>
    </View>
  );
};
