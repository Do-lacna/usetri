import { useQueryClient } from '@tanstack/react-query';
import { Keyboard } from 'react-native';
import {
  getGetHybridCartComparisonQueryKey,
  getGetHybridCartQueryKey,
  useAddToHybridCart,
  useGetHybridCart,
} from '~/network/hybrid-cart/hybrid-cart';
import { CartOperationsEnum } from '../app/(app)/main/(tabs)/shopping-list';
import { getSimplifiedCart } from '../lib/utils';
import {} from '../network/customer/customer';
import { displayErrorToastMessage } from '../utils/toast-utils';

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
  } = useGetHybridCart();

  const {
    mutate: sendUpdateCart,
    isIdle,
    isPending,
  } = useAddToHybridCart({
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
          queryKey: getGetHybridCartQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetHybridCartComparisonQueryKey(),
        });
        Keyboard.dismiss();
        onSuccessfullCartUpdate?.();
      },
    },
  });

  const handleAddProductToCart = (barcode?: string, quantity = 1) => {
    if (!barcode) return;
    //TODO call on success
    //   setSearchQuery("");
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: {
        category_items,
        product_items: [...product_items, { barcode, quantity }],
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
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
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleRemoveItemFromCart = (
    type: 'category' | 'product',
    id?: number | string,
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
      updatedProducts = product_items?.filter(({ barcode }) => barcode !== id);
    }
    sendUpdateCart({
      data: {
        category_items: updatedCategories,
        product_items: updatedProducts,
      },
    });
  };

  const handleUpdateProductQuantity = (barcode: string, quantity: number) => {
    if (!barcode) return;
    if (quantity < 1) {
      handleRemoveItemFromCart('product', barcode);
      return;
    }
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const updatedProducts = product_items.map(product =>
      product.barcode === barcode ? { ...product, quantity } : product,
    );
    sendUpdateCart({
      data: { category_items, product_items: updatedProducts },
      additionalData: {
        operation: CartOperationsEnum.UPDATE,
      },
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
      additionalData: {
        operation: CartOperationsEnum.UPDATE,
      },
    });
  };

  const handleChooseProductFromCategory = (
    barcode: string,
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
        product_items: [...product_items, { barcode, quantity: 1 }],
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
    });
  };

  const handleSwitchProduct = (originalBarcode: string, barcode: string) => {
    const { product_items = [], category_items = [] } = getSimplifiedCart(cart);
    const updatedProducts = product_items
      ?.filter(
        ({ barcode: productBarcode }) => productBarcode !== originalBarcode,
      )
      .concat({ barcode, quantity: 1 });

    sendUpdateCart({
      data: {
        product_items: updatedProducts,
        category_items,
        //TODO fix this mirror quantity
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
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
