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
          'Nepodarilo sa aktualizovať nákupný zoznam',
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
    //TODO call on success
    //   setSearchQuery("");
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

    //   setSearchQuery("");
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
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    let updatedCategories = category_items;
    let updatedProducts = product_items;
    //TODO when BE adjusts DTO uncomment this
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

    const updatedCategoryIds = category_items.some(
      c => c.category_id === categoryId,
    )
      ? category_items.filter(({ category_id }) => category_id !== categoryId)
      : category_items;

    sendUpdateCart({
      data: {
        category_items: updatedCategoryIds,
        //TODO fix this mirror quantity
        product_items: [
          ...product_items,
          { product_id: productId, quantity: 1 },
        ],
      },
    });
  };

  const handleSwitchProduct = (
    originalProductId: number,
    productId: number,
  ) => {
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const updatedProducts = product_items
      ?.filter(({ product_id }) => product_id !== originalProductId)
      .concat({ product_id: productId, quantity: 1 });

    sendUpdateCart({
      data: {
        product_items: updatedProducts,
        category_items,
        //TODO fix this mirror quantity
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
