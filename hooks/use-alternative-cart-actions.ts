import { useQueryClient } from "@tanstack/react-query";
import { Keyboard } from "react-native";
import { CartOperationsEnum } from "../app/(app)/main/(tabs)/shopping-list";
import { getSimplifiedCartAlternative } from "../lib/utils";
import { ProductCartItemDto } from "../network/model";
import {
  getGetProductCartQueryKey,
  useAddToProductCart,
  useGetProductCart,
} from "../network/product-cart/product-cart";
import { displayErrorToastMessage } from "../utils/toast-utils";

export type UseCartActionsProps = {
  onSuccessWithExpandedOption?: (categoryId?: number) => void;
  onSuccessfullCartUpdate?: () => void;
};

export const useAlternativeCartActions = ({
  onSuccessWithExpandedOption,
  onSuccessfullCartUpdate,
}: UseCartActionsProps) => {
  const queryClient = useQueryClient();
  const { data: { cart } = {} } = ({} = useGetProductCart());

  const {
    mutate: sendUpdateCart,
    isIdle,
    isPending,
  } = useAddToProductCart({
    mutation: {
      onError: () => {
        displayErrorToastMessage(
          "Nepodarilo sa aktualizovať nákupný zoznam",
          "top"
        );
      },
      // onMutate: ({ data }) => {},
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetProductCartQueryKey(),
        });
        // const lastAddedCategory = cart?.categories?.slice(-1)[0]?.category?.id;
        // if (
        //   lastAddedCategory &&
        //   variables?.additionalData?.operation === CartOperationsEnum.ADD
        // ) {
        //   onSuccessWithExpandedOption?.(lastAddedCategory);
        // }
        Keyboard.dismiss();
        onSuccessfullCartUpdate?.();
      },
    },
  });

  const handleAddProductToCart = (barcode?: string, quantity = 1) => {
    if (!barcode) return;
    //TODO call on success
    //   setSearchQuery("");
    const { products = [] } = getSimplifiedCartAlternative(cart);

    const updatedProducts = products as ProductCartItemDto[];

    sendUpdateCart({
      data: { items: [...updatedProducts, { barcode, quantity }] },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleRemoveItemFromCart = (
    type: "category" | "product",
    id?: number | string
  ) => {
    const { products } = getSimplifiedCartAlternative(cart);
    const updatedProducts = products?.filter(
      ({ barcode }) => barcode !== id
    ) as ProductCartItemDto[];

    sendUpdateCart({
      data: { items: updatedProducts },
    });
  };

  const handleUpdateProductQuantity = (barcode: string, quantity: number) => {
    if (!barcode) return;
    if (quantity < 1) {
      handleRemoveItemFromCart("product", barcode);
      return;
    }
    const { products = [] } = getSimplifiedCartAlternative(cart);
    const updatedProducts = products.map((product) =>
      product.barcode === barcode ? { ...product, quantity } : product
    ) as ProductCartItemDto[];
    sendUpdateCart({
      data: { items: updatedProducts },
      additionalData: {
        operation: CartOperationsEnum.UPDATE,
      },
    });
  };

  const handleSwitchProduct = (originalBarcode: string, barcode: string) => {
    const { products = [] } = getSimplifiedCartAlternative(cart);
    const updatedProducts = products?.filter(
      ({ barcode: productBarcode }) => productBarcode !== originalBarcode
    ) as ProductCartItemDto[];

    sendUpdateCart({
      data: {
        //TODO fix this mirror quantity
        items: [...updatedProducts, { barcode, quantity: 1 }],
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
    });
  };

  return {
    handleAddProductToCart,
    handleRemoveItemFromCart,
    handleSwitchProduct,
    handleUpdateProductQuantity,
    isLoading: isPending,
  };
};
