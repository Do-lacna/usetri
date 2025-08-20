import React, { useEffect } from "react";
import { Image, View } from "react-native";
import type { PendingCartDataType } from "~/app/(app)/main/(tabs)/shopping-list";
import { isArrayNotEmpty } from "~/lib/utils";
import { useGetHybridCart } from "~/network/hybrid-cart/hybrid-cart";
import type { ShopPriceDto } from "~/network/model";
import { useGetProductsByBarcode } from "~/network/query/query";
import { getShopLogo } from "~/utils/logo-utils";
import { Button } from "../button";
import Counter from "../counter";
import { Text } from "../text";
import { CartItemHeader } from "./cart-item-header";

export enum PendingCartItemActionEnum {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

interface ProductCartItemProps {
  pendingCartData: PendingCartDataType;
  onDismiss: () => void;
  onConfirm: (
    pendingCartData?: PendingCartDataType,
    quantity?: number,
    action?: PendingCartItemActionEnum
  ) => void;
  isLoading?: boolean;
}

export const ProductCartItem: React.FC<ProductCartItemProps> = ({
  pendingCartData,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const [productCount, setProductCount] = React.useState(1);

  const { data: { cart } = {}, isLoading: isCartLoading } = ({} =
    useGetHybridCart());

  const { data: productData, isLoading: areProductsLoading } =
    useGetProductsByBarcode(
      String(pendingCartData?.identifier),
      {},
      {
        query: {
          enabled: true,
        },
      }
    );

  const isLoadingGlobal = isLoading || areProductsLoading;

  const itemInCartCount =
    cart?.specific_products?.find(
      ({ product: { barcode } = {} }) => barcode === pendingCartData?.identifier
    )?.quantity ?? 0;

  useEffect(() => {
    if (itemInCartCount > 0) {
      setProductCount(itemInCartCount);
    } else {
      setProductCount(1);
    }
  }, [itemInCartCount]);

  const {
    detail: {
      name = "",
      brand = "",
      image_url,
      unit_dto: {
        normalized_amount: amount = "",
        normalized_unit: unit = "",
      } = {},
      category: { image_url: categoryImageUrl } = {},
    } = {},
    shops_prices,
  } = productData ?? {};

  const itemDetail = {
    title: `${brand} ${name}`,
    image_url: image_url ?? categoryImageUrl,
    amount: `${amount} ${unit}`,
    price: shops_prices?.[0]?.price ?? 0,
    shops_prices: shops_prices ?? [],
  };

  const handleConfirm = (count: number) => {
    onConfirm(
      pendingCartData,
      count,
      itemInCartCount > 0
        ? PendingCartItemActionEnum.UPDATE
        : PendingCartItemActionEnum.ADD
    );
  };

  return (
    <View className="flex flex-col justify-between w-full p-4">
      <View>
        <CartItemHeader
          image_url={itemDetail.image_url}
          title={itemDetail.title}
          amountUnit={itemDetail.amount}
          onDismiss={onDismiss}
        />

        {/* Shop Availability Section */}
        {isArrayNotEmpty(itemDetail.shops_prices) && (
          <View className="mb-2">
            <Text className="text-sm text-gray-600 mb-2">Dostupné v:</Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {itemDetail.shops_prices?.map(
                ({ shop_id, price }: ShopPriceDto) => (
                  <View
                    key={shop_id}
                    className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1"
                  >
                    <Image
                      {...getShopLogo(shop_id as any)}
                      className="w-6 h-6 mr-1"
                      resizeMode="contain"
                    />
                    {price && (
                      <Text className="text-xs text-gray-500 ml-1">
                        {price.toFixed(2)}€
                      </Text>
                    )}
                  </View>
                )
              )}
            </View>
          </View>
        )}
      </View>

      {/* Actions Section - Wolt Style */}
      <View className="w-full flex-row gap-4 items-center justify-between my-6">
        {/* Counter on the left */}
        <Counter initialCount={productCount} onCountChange={setProductCount} />

        {/* Confirm button on the right */}
        <Button
          onPress={() => handleConfirm(productCount)}
          className="flex-1 flex-row ml-4 px-2 justify-between"
          disabled={isLoadingGlobal}
        >
          <Text>Pridať do košíka</Text>
          <Text>{((itemDetail.price ?? 0) * productCount)?.toFixed(2)}€</Text>
        </Button>
      </View>
    </View>
  );
};
