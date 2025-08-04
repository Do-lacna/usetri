import React, { useEffect } from "react";
import { Image, View } from "react-native";
import {
  DrawerTypeEnum,
  PendingCartDataType,
} from "~/app/(app)/main/(tabs)/shopping-list";
import { PLACEHOLDER_PRODUCT_IMAGE } from "~/lib/constants";
import { isArrayNotEmpty } from "../../../lib/utils";
import { useGetHybridCart } from "../../../network/hybrid-cart/hybrid-cart";
import { ShopPriceDto } from "../../../network/model";
import {
  useGetCategories,
  useGetProductsByBarcode,
} from "../../../network/query/query";
import { getShopLogo } from "../../../utils/logo-utils";
import { Button } from "../button";
import Counter from "../counter";
import Divider from "../divider";
import { Text } from "../text";

export enum PendingCartItemActionEnum {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}
interface ShoppingListFilterContentProps {
  pendingCartData?: PendingCartDataType | null;
  onDismiss: () => void;
  onConfirm: (
    pendingCartData?: PendingCartDataType,
    quantity?: number,
    action?: PendingCartItemActionEnum
  ) => void;
  isLoading?: boolean;
}

export type ItemDetailType = {
  title?: string | null;
  image_url?: string | null;
  amount?: string | null;
  price?: number | null;
  shops_prices?: ShopPriceDto[];
};

const PendingCartItemDrawerContent: React.FC<
  ShoppingListFilterContentProps
> = ({ pendingCartData, onDismiss, onConfirm, isLoading = false }) => {
  const [productCount, setProductCount] = React.useState(1);

  const { data: { cart } = {}, isLoading: isCartLoading } = ({} =
    useGetHybridCart());

  const { data: productData, isLoading: areProductsLoading } =
    useGetProductsByBarcode(
      String(pendingCartData?.identifier),
      {},
      {
        query: {
          enabled: pendingCartData?.type === DrawerTypeEnum.PRODUCT,
        },
      }
    );

  const { data: categoryData, isLoading: areCategoriesLoading } =
    useGetCategories(
      {},
      {
        query: {
          select: (data) =>
            data?.categories?.find((category) => {
              return category?.id === Number(pendingCartData?.identifier);
            }) ?? null,
          enabled: pendingCartData?.type === DrawerTypeEnum.CATEGORY,
        },
      }
    );

  const isLoadingGlobal =
    isLoading || areProductsLoading || areCategoriesLoading;

  const itemInCartCount =
    pendingCartData?.type === DrawerTypeEnum.PRODUCT
      ? cart?.specific_products?.find(
          ({ product: { barcode } = {} }) =>
            barcode === pendingCartData?.identifier
        )?.quantity ?? 0
      : cart?.categories?.find(
          ({ category }) => category?.id === Number(pendingCartData?.identifier)
        )?.quantity ?? 0;

  useEffect(() => {
    if (itemInCartCount > 0) {
      setProductCount(itemInCartCount);
    } else {
      setProductCount(1);
    }
  }, [itemInCartCount]);

  if (!pendingCartData) return null;

  let itemDetail: ItemDetailType = {
    title: "",
    image_url: null,
    amount: null,
    price: null,
    shops_prices: [] as ShopPriceDto[],
  };

  // Extract shops data for products

  if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
    itemDetail = {
      title: categoryData?.name,
      image_url: categoryData?.image_url,
      amount: null,
      price: null,
    };
  } else {
    const {
      detail: {
        name = "",
        brand = "",
        image_url,
        amount,
        unit,
        category: { image_url: categoryImageUrl } = {},
      } = {},
      shops_prices,
    } = productData ?? {};

    itemDetail = {
      title: `${brand} ${name}`,
      image_url: image_url ?? categoryImageUrl,
      amount: `${amount} ${unit}`,
      price: shops_prices?.[0]?.price ?? 0,
      shops_prices: shops_prices ?? [],
    };
  }

  //TODO display better if item is already in cart and action is Updating its quantity not adding it

  return (
    <View className="flex flex-col justify-between w-full p-4">
      <View>
        <View className="w-full h-48 justify-center items-center">
          <Image
            source={{
              uri: itemDetail?.image_url ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-1/2 resize-contain"
            resizeMode="contain"
          />
        </View>

        <Divider className="w-full my-4" />

        <View className="flex-row items-start mb-4">
          <Text className="text-xl font-bold flex-1 mr-3" numberOfLines={2}>
            {itemDetail?.title}
          </Text>
          {itemDetail?.amount && (
            <Text className="text-md text-gray-500 text-right min-w-fit">
              {itemDetail?.amount}
            </Text>
          )}
        </View>

        {/* Category Info Message - Only show for categories */}
        {pendingCartData?.type === DrawerTypeEnum.CATEGORY && (
          <View className="mb-4 bg-green-50 border border-blue-200 rounded-lg p-3">
            <Text className="text-sm text-green-700 leading-relaxed">
              Pridaním kategórie do košíka bude vo finálnom porovnaní z každého
              obchodu vybraný najlacnejší produkt
            </Text>
          </View>
        )}

        {/* Shop Availability Section - Only show for products */}
        {pendingCartData?.type === DrawerTypeEnum.PRODUCT &&
          isArrayNotEmpty(itemDetail?.shops_prices) && (
            <View className="mb-2">
              <Text className="text-sm text-gray-600 mb-2">Dostupné v:</Text>
              <View className="flex-row flex-wrap items-center gap-2">
                {itemDetail?.shops_prices?.map(({ shop_id, price }) => (
                  <View
                    key={shop_id}
                    className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1"
                  >
                    <Image
                      {...getShopLogo(shop_id as any)}
                      className="w-6 h-6 mr-1"
                      resizeMode="contain"
                    />
                    {/* <Text className="text-xs text-gray-700">{shop.name}</Text> */}
                    {price && (
                      <Text className="text-xs text-gray-500 ml-1">
                        {price.toFixed(2)}€
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

        <View className="flex-row items-center justify-between my-4 space-x-2">
          <Text className="text-2xl font-bold">
            {((itemDetail?.price ?? 0) * productCount)?.toFixed(2)} €
          </Text>
          <Counter
            initialCount={productCount}
            onCountChange={setProductCount}
          />
        </View>
      </View>
      <View className="w-full flex-row gap-4 items-center justify-center mt-8">
        <Button
          onPress={onDismiss}
          variant="outline"
          className="w-1/3"
          disabled={isLoadingGlobal}
        >
          <Text>Zrušiť</Text>
        </Button>
        <Button
          onPress={() =>
            onConfirm(
              pendingCartData,
              productCount,
              itemInCartCount > 0
                ? PendingCartItemActionEnum.UPDATE
                : PendingCartItemActionEnum.ADD
            )
          }
          className="w-1/2"
          disabled={isLoadingGlobal}
        >
          <Text>Pridať do zoznamu</Text>
        </Button>
      </View>
    </View>
  );
};

export default PendingCartItemDrawerContent;
