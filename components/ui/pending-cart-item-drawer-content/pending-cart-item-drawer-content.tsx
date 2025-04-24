import React from 'react';
import { Image, View } from 'react-native';
import {
  useGetCategories,
  useGetProductsByBarcode,
} from '../../../network/query/query';
import { Button } from '../button';
import Counter from '../counter';
import Divider from '../divider';
import { Text } from '../text';
import {
  DrawerTypeEnum,
  PendingCartDataType,
} from '~/app/(app)/main/(tabs)/shopping-list';

interface ShoppingListFilterContentProps {
  pendingCartData?: PendingCartDataType | null;
  onDismiss: () => void;
  onConfirm: (pendingCartData?: PendingCartDataType, quantity?: number) => void;
}

export type ItemDetailType = {
  title?: string | null;
  image_url?: string | null;
  amount?: string | null;
  price?: number | null;
};

const PendingCartItemDrawerContent: React.FC<
  ShoppingListFilterContentProps
> = ({ pendingCartData, onDismiss, onConfirm }) => {
  const [productCount, setProductCount] = React.useState(1);

  const { data, isLoading } = useGetProductsByBarcode(
    String(pendingCartData?.identifier),
    {},
    {
      query: {
        enabled: pendingCartData?.type === DrawerTypeEnum.PRODUCT,
      },
    },
  );

  const { data: categoryData } = useGetCategories(
    {},
    {
      query: {
        select: (data) =>
          data?.categories?.find((category) => {
            return category?.id === Number(pendingCartData?.identifier)
          }) ?? null,
        enabled: pendingCartData?.type === DrawerTypeEnum.CATEGORY,
      },
    },
  );


  if (!pendingCartData) return null;

  let itemDetail: ItemDetailType = {
    title: '',
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
      detail: { name, brand, image_url, amount, unit } = {},
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
    <View className="w-full p-4 ">
      <Image
        source={{
          uri:
            itemDetail?.image_url ??
            'https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540',
        }}
        className="w-full h-52 rounded-lg"
        resizeMode="contain"
      />
      <Divider className="w-full my-4" />

      <Text className="text-xl font-bold">{itemDetail?.title}</Text>
      <Text className="text-md text-gray-500">{itemDetail?.amount}</Text>
      <View className="flex-row items-center justify-between my-4 space-x-2">
        <Text className="text-2xl font-bold">
          {(itemDetail?.price ?? 0) * productCount} €
        </Text>
        <Counter initialCount={productCount} onCountChange={setProductCount} />
      </View>
      <View className="w-full flex-row gap-4 items-center justify-center">
        <Button onPress={onDismiss} variant="outline" className="w-1/3">
          <Text>Zrušiť</Text>
        </Button>
        <Button
          onPress={() => onConfirm(pendingCartData, productCount)}
          className="w-1/2"
        >
          <Text>Pridať do zoznamu</Text>
        </Button>
      </View>
    </View>
  );
};

export default PendingCartItemDrawerContent;
