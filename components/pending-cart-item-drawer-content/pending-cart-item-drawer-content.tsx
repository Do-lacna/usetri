import type React from 'react';
import {
  DrawerTypeEnum,
  type PendingCartDataType,
} from '~/app/(app)/main/(tabs)/shopping-list';
import { useGetHybridCart } from '~/network/hybrid-cart/hybrid-cart';
import { CategoryCartItem } from './category-cart-item';
import {
  PendingCartItemActionEnum,
  ProductCartItem,
} from './product-cart-item';

interface ShoppingListFilterContentProps {
  pendingCartData?: PendingCartDataType | null;
  onDismiss: () => void;
  onConfirm: (
    pendingCartData?: PendingCartDataType,
    quantity?: number,
    action?: PendingCartItemActionEnum,
  ) => void;
  isLoading?: boolean;
}

const PendingCartItemDrawerContent: React.FC<
  ShoppingListFilterContentProps
> = ({ pendingCartData, onDismiss, onConfirm, isLoading = false }) => {
  const {
    data: { cart } = {},
    isLoading: isCartLoading,
  } = useGetHybridCart();

  if (!pendingCartData) return null;

  // Check if category already exists in cart
  const categoryInCartCount =
    pendingCartData.type === DrawerTypeEnum.CATEGORY
      ? (cart?.categories?.find(
          ({ category }) =>
            category?.id === Number(pendingCartData?.identifier),
        )?.quantity ?? 0)
      : 0;

  const handleCategoryConfirm = (quantity: number) => {
    const action =
      categoryInCartCount > 0
        ? PendingCartItemActionEnum.UPDATE
        : PendingCartItemActionEnum.ADD;
    onConfirm(pendingCartData, quantity, action);
  };

  if (pendingCartData.type === DrawerTypeEnum.CATEGORY) {
    return (
      <CategoryCartItem
        pendingCartData={pendingCartData}
        onDismiss={onDismiss}
        onConfirm={handleCategoryConfirm}
        isLoading={isLoading || isCartLoading}
      />
    );
  }

  return (
    <ProductCartItem
      pendingCartData={pendingCartData}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      isLoading={isLoading || isCartLoading}
    />
  );
};

export default PendingCartItemDrawerContent;
