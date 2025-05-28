import React from "react";
import { Image, View } from "react-native";
import {
  DrawerTypeEnum,
  PendingCartDataType,
} from "~/app/(app)/main/(tabs)/shopping-list";
import { PLACEHOLDER_PRODUCT_IMAGE } from "~/lib/constants";
import { generateImageUrl } from "~/lib/utils";
import {
  useGetCategories,
  useGetProductsByBarcode,
} from "../../../network/query/query";
import { Button } from "../button";
import Counter from "../counter";
import Divider from "../divider";
import { Text } from "../text";

interface ShoppingListFilterContentProps {
  pendingCartData?: PendingCartDataType | null;
  onDismiss: () => void;
  onConfirm: (pendingCartData?: PendingCartDataType, quantity?: number) => void;
  isLoading?: boolean;
}

export type ItemDetailType = {
  title?: string | null;
  image_url?: string | null;
  amount?: string | null;
  price?: number | null;
};

const PendingCartItemDrawerContent: React.FC<
  ShoppingListFilterContentProps
> = ({ pendingCartData, onDismiss, onConfirm, isLoading = false }) => {
  const [productCount, setProductCount] = React.useState(1);

  const { data, isLoading: areProductsLoading } = useGetProductsByBarcode(
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

  if (!pendingCartData) return null;

  let itemDetail: ItemDetailType = {
    title: "",
    image_url: null,
    amount: null,
    price: null,
  };

  if (pendingCartData?.type === DrawerTypeEnum.CATEGORY) {
    itemDetail = {
      title: categoryData?.name,
      image_url: categoryData?.image_url,
      amount: null,
      price: null,
    };
  } else {
    const {
      detail: { name = "", brand = "", image_url, amount, unit } = {},
      price,
    } = data?.products?.[0] || {};
    itemDetail = {
      title: `${brand} ${name}`,
      image_url,
      amount: `${amount} ${unit}`,
      price,
    };
  }

  return (
    <View className="flex flex-col justify-between w-full p-4">
      <View>
        <View className="w-full h-48 justify-center items-center">
          <Image
            source={{
              uri: itemDetail?.image_url
                ? (generateImageUrl(itemDetail?.image_url) as string)
                : PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-1/2 resize-contain"
            resizeMode="contain"
          />
        </View>

        <Divider className="w-full my-4" />

        <Text className="text-xl font-bold">{itemDetail?.title}</Text>
        <Text className="text-md text-gray-500">{itemDetail?.amount}</Text>
        <View className="flex-row items-center justify-between my-4 space-x-2">
          <Text className="text-2xl font-bold">
            {(itemDetail?.price ?? 0) * productCount} €
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
          onPress={() => onConfirm(pendingCartData, productCount)}
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
