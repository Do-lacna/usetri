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
    const { products = [], categories = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: { categories, products: [...products, { barcode, quantity }] },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
      //here I want to pass more data for example to the context
    });
  };

  const handleAddCategoryToCart = (categoryId: number, quantity = 1) => {
    if (!categoryId) return;

    //   setSearchQuery("");
    const { products = [], categories = [] } = getSimplifiedCart(cart);

    sendUpdateCart({
      data: {
        products,
        categories: [...categories, { category_id: categoryId, quantity }],
      },
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
    const { products, categories } = getSimplifiedCart(cart);
    let updatedCategories = categories;
    let updatedProducts = products;
    //TODO when BE adjusts DTO uncomment this
    if (type === "category") {
      updatedCategories = categories?.filter(
        ({ category_id }) => category_id !== id
      );
    } else {
      updatedProducts = products?.filter(({ barcode }) => barcode !== id);
    }
    sendUpdateCart({
      data: { categories: updatedCategories, products: updatedProducts },
    });
  };

  const handleUpdateProductQuantity = (barcode: string, quantity: number) => {
    if (!barcode) return;
    if (quantity < 1) {
      handleRemoveItemFromCart("product", barcode);
      return;
    }
    const { products = [], categories = [] } = getSimplifiedCart(cart);
    const updatedProducts = products.map((product) =>
      product.barcode === barcode ? { ...product, quantity } : product
    );
    sendUpdateCart({
      data: { categories, products: updatedProducts },
      additionalData: {
        operation: CartOperationsEnum.UPDATE,
      },
    });
  };

  const handleUpdateCategoryQuantity = (
    categoryId: number,
    quantity: number
  ) => {
    if (!categoryId) return;
    if (quantity < 1) {
      handleRemoveItemFromCart("category", categoryId);
      return;
    }
    const { products = [], categories = [] } = getSimplifiedCart(cart);
    const updatedCategories = categories.map((category) =>
      category?.category_id === categoryId
        ? { ...category, quantity }
        : category
    );
    sendUpdateCart({
      data: { categories: updatedCategories, products },
      additionalData: {
        operation: CartOperationsEnum.UPDATE,
      },
    });
  };

  const handleChooseProductFromCategory = (
    barcode: string,
    categoryId: number
  ) => {
    const { products = [], categories = [] } = getSimplifiedCart(cart);

    const updatedCategoryIds = categories.some(
      (c) => c.category_id === categoryId
    )
      ? categories.filter(({ category_id }) => category_id !== categoryId)
      : categories;

    sendUpdateCart({
      data: {
        categories: updatedCategoryIds,
        //TODO fix this mirror quantity
        products: [...products, { barcode, quantity: 1 }],
      },
      additionalData: {
        operation: CartOperationsEnum.ADD,
      },
    });
  };

  const handleSwitchProduct = (originalBarcode: string, barcode: string) => {
    const { products = [], categories = [] } = getSimplifiedCart(cart);
    const updatedProducts = products?.filter(
      ({ barcode: productBarcode }) => productBarcode !== originalBarcode
    );

    sendUpdateCart({
      data: {
        products: updatedProducts,
        categories,
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
