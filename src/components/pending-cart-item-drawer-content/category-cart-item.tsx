import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import type { PendingCartDataType } from '~/src/types/cart-drawer-types';
import { useGetCart } from '~/src/network/cart/cart';
import {
  useGetCategories,
  useGetCategoryPrices,
} from '~/src/network/query/query';
import { CategoryPricesGrid } from '../category-prices-grid';
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
  } = useGetCart();

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
    originalPrice: price?.price ?? 0,
    discountPrice: price?.discount_price?.price,
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

        <View className="mb-4 bg-success/10 border border-success/30 rounded-lg p-3">
          <Text className="text-sm font-expose text-success leading-relaxed">
            {t('cart_drawer.category_info')}
          </Text>
        </View>

        <CategoryPricesGrid categoryPrices={categoryPrices} className="mb-6" />
      </View>

      <View className="w-full flex-row gap-4 items-center justify-between mt-6 mb-6">
        <Counter
          initialCount={categoryCount}
          onCountChange={setCategoryCount}
        />

        <Button
          onPress={() => onConfirm(categoryCount)}
          className="flex-1 ml-4"
          disabled={isLoadingGlobal}
        >
          <Text className="font-expose-bold">
            {t('cart_drawer.add_category')}
          </Text>
        </Button>
      </View>
    </View>
  );
};
