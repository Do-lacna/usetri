import React from "react";
import { Image, View } from "react-native";
import { useGetProductsByBarcode } from "../../../network/query/query";
import { Button } from "../button";
import Counter from "../counter";
import Divider from "../divider";
import { Text } from "../text";

interface ShoppingListFilterContentProps {
  barcode?: string | null;
  onDismiss: () => void;
  onConfirm: (barcode: string, quantity: number) => void;
}

const PendingCartItemDrawerContent: React.FC<
  ShoppingListFilterContentProps
> = ({ barcode, onDismiss, onConfirm }) => {
  const { data, isLoading } = useGetProductsByBarcode(String(barcode));
  const [productCount, setProductCount] = React.useState(1);

  const { detail: { name, brand, image_url, amount, unit } = {}, price } =
    data?.products?.[0] || {};
  return (
    <View className="w-full p-4 ">
      <Image
        source={{
          uri:
            image_url ??
            "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
        }}
        className="w-full h-52 rounded-lg"
        resizeMode="contain"
      />
      <Divider className="w-full my-4" />

      <Text className="text-xl font-bold">
        {brand} {name}
      </Text>
      <Text className="text-md text-gray-500">{`${amount} ${unit}`}</Text>
      <View className="flex-row items-center justify-between my-4 space-x-2">
        <Text className="text-2xl font-bold">
          {(price ?? 0) * productCount} €
        </Text>
        <Counter initialCount={productCount} onCountChange={setProductCount} />
      </View>
      <View className="w-full flex-row gap-4 items-center justify-center">
        <Button onPress={onDismiss} variant="outline" className="w-1/3">
          <Text>Zrušiť</Text>
        </Button>
        <Button
          onPress={() => onConfirm(String(barcode), productCount)}
          className="w-1/2"
        >
          <Text>Pridať do zoznamu</Text>
        </Button>
      </View>
    </View>
  );
};

export default PendingCartItemDrawerContent;
