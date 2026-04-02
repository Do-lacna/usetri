import { useQueryClient } from '@tanstack/react-query';
import { Keyboard } from 'react-native';
import { getSimplifiedCart } from '~/src/lib/utils';
import {
  getGetCartComparisonQueryKey,
  getGetCartQueryKey,
  useAddToCart,
  useGetCart,
} from '~/src/network/cart/cart';
import {} from '~/src/network/customer/customer';
import i18n from 'i18next';
import { logAddToCart, logRemoveFromCart } from '~/src/utils/analytics';
import { displayErrorToastMessage } from '~/src/utils/toast-utils';

export type UseCartActionsProps = {
  onSuccessWithExpandedOption?: (categoryId?: number) => void;
  onSuccessfullCartUpdate?: () => void;
};

export const useCartActions = ({
  onSuccessWithExpandedOption,
  onSuccessfullCartUpdate,
}: UseCartActionsProps) => {
  const queryClient = useQueryClient();
  const {
    data: { cart } = {},
  } = useGetCart();

  const {
    mutate: sendUpdateCart,
    isIdle,
    isPending,
  } = useAddToCart({
    mutation: {
      onError: e => {
        displayErrorToastMessage(
          i18n.t('shopping_list.update_error'),
          'top',
        );
      },
      // onMutate: ({ data }) => {},
      onSuccess: ({ cart }, variables) => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetCartComparisonQueryKey(),
        });
        Keyboard.dismiss();
        onSuccessfullCartUpdate?.();
      },
    },
  });

  const handleAddProductToCart = (productId?: number, quantity = 1) => {
    if (!productId) return;
    logAddToCart(productId);
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: {
        category_items,
        product_items: [...product_items, { product_id: productId, quantity }],
      },
    });
  };

  const handleAddCategoryToCart = (categoryId: number, quantity = 1) => {
    if (!categoryId) return;

    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: {
        product_items,
        category_items: [
          ...category_items,
          { category_id: categoryId, quantity },
        ],
      },
    });
  };

  const handleRemoveItemFromCart = (
    type: 'category' | 'product',
    id?: number,
  ) => {
    if (id && type === 'product') logRemoveFromCart(id);
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    let updatedCategories = category_items;
    let updatedProducts = product_items;
    if (type === 'category') {
      updatedCategories = category_items?.filter(
        ({ category_id }) => category_id !== id,
      );
    } else {
      updatedProducts = product_items?.filter(
        ({ product_id }) => product_id !== id,
      );
    }
    sendUpdateCart({
      data: {
        category_items: updatedCategories,
        product_items: updatedProducts,
      },
    });
  };

  const handleUpdateProductQuantity = (productId: number, quantity: number) => {
    if (!productId) return;
    if (quantity < 1) {
      handleRemoveItemFromCart('product', productId);
      return;
    }
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const updatedProducts = product_items.map(product =>
      product?.product_id === productId ? { ...product, quantity } : product,
    );
    sendUpdateCart({
      data: { category_items, product_items: updatedProducts },
    });
  };

  const handleUpdateCategoryQuantity = (
    categoryId: number,
    quantity: number,
  ) => {
    if (!categoryId) return;
    if (quantity < 1) {
      handleRemoveItemFromCart('category', categoryId);
      return;
    }
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const updatedCategories = category_items.map(category =>
      category?.category_id === categoryId
        ? { ...category, quantity }
        : category,
    );
    sendUpdateCart({
      data: { category_items: updatedCategories, product_items },
    });
  };

  const handleChooseProductFromCategory = (
    productId: number,
    categoryId: number,
  ) => {
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);

    const existingCategory = category_items.find(
      c => c.category_id === categoryId,
    );
    const quantity = existingCategory?.quantity ?? 1;

    const updatedCategoryIds = existingCategory
      ? category_items.filter(({ category_id }) => category_id !== categoryId)
      : category_items;

    sendUpdateCart({
      data: {
        category_items: updatedCategoryIds,
        product_items: [
          ...product_items,
          { product_id: productId, quantity },
        ],
      },
    });
  };

  const handleSwitchProduct = (
    originalProductId: number,
    productId: number,
  ) => {
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const originalQuantity =
      product_items.find(p => p.product_id === originalProductId)?.quantity ?? 1;
    const updatedProducts = product_items
      ?.filter(({ product_id }) => product_id !== originalProductId)
      .concat({ product_id: productId, quantity: originalQuantity });

    sendUpdateCart({
      data: {
        product_items: updatedProducts,
        category_items,
      },
    });
  };

  return {
    handleAddCategoryToCart,
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleChooseProductFromCategory,
    handleUpdateProductQuantity,
    handleUpdateCategoryQuantity,
    handleSwitchProduct,
    isLoading: isPending,
  };
};
