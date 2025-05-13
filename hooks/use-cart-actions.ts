import { useQueryClient } from "@tanstack/react-query";
import { Keyboard } from "react-native";
import { CartOperationsEnum } from "../app/(app)/main/(tabs)/shopping-list";
import { getSimplifiedCart } from "../lib/utils";
import {
  getGetCartQueryKey,
  useCreateCart,
  useGetCart,
} from "../network/customer/customer";
import { displayErrorToastMessage } from "../utils/toast-utils";

export type UseCartActionsProps = {
  onSuccessWithExpandedOption?: (categoryId?: number) => void;
  onSuccessfullCartUpdate?: () => void;
};

export const useCartActions = ({
  onSuccessWithExpandedOption,
  onSuccessfullCartUpdate,
}: UseCartActionsProps) => {
  const queryClient = useQueryClient();
  const { data: { cart } = {} } = ({} = useGetCart());

  const {
    mutate: sendUpdateCart,
    isIdle,
    isPending,
  } = useCreateCart({
    mutation: {
      onError: () => {
        displayErrorToastMessage(
          "Nepodarilo sa aktualizovať nákupný zoznam",
          "top"
        );
      },
      // onMutate: ({ data }) => {},
      onSuccess: ({ cart }, variables) => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey(),
        });
        const lastAddedCategory = cart?.categories?.slice(-1)[0]?.category?.id;
        if (
          lastAddedCategory &&
          variables?.additionalData?.operation === CartOperationsEnum.ADD
        ) {
          onSuccessWithExpandedOption?.(lastAddedCategory);
        }
        Keyboard.dismiss();
        onSuccessfullCartUpdate?.();
      },
    },
  });

  const handleAddProductToCart = (barcode?: string, quantity = 1) => {
    if (!barcode) return;
    //TODO call on success
    //   setSearchQuery("");
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: { category_ids, barcodes: [...barcodes, barcode] },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleAddCategoryToCart = (categoryId: number, quantity = 1) => {
    if (!categoryId) return;

    //   setSearchQuery("");
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: { barcodes, category_ids: [...category_ids, categoryId] },
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
    const simplifiedCart = getSimplifiedCart(cart);
    //TODO when BE adjusts DTO uncomment this
    if (type === "category") {
      simplifiedCart.category_ids = simplifiedCart.category_ids?.filter(
        (categoryId) => categoryId !== id
      );
    } else {
      simplifiedCart.barcodes = simplifiedCart.barcodes?.filter(
        (barcode) => barcode !== id
      );
    }
    sendUpdateCart({ data: simplifiedCart });
  };

  const handleChooseProductFromCategory = (
    barcode: string,
    categoryId: number
  ) => {
    const { barcodes = [], category_ids = [] } = getSimplifiedCart(cart);

    const updatedCategoryIds = category_ids.includes(categoryId)
      ? category_ids.filter((id) => id !== categoryId)
      : category_ids;

    sendUpdateCart({
      data: {
        category_ids: updatedCategoryIds,
        barcodes: [...barcodes, barcode],
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
    isLoading: isPending,
  };
};
