import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { CirclePlus } from "~/lib/icons/CirclePlus";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../../lib/constants";
import { ShopItemDto } from "../../../network/model";
import { useGetShops } from "../../../network/query/query";
import { getShopLogo } from "../../../utils/logo-utils";
import IconButton from "../../icon-button";
import { Badge } from "../badge";

export interface IProduct {
  id: string;
  imageUrl?: string;
  name?: string;
  brand?: string;
  amount?: string;
  price?: string;
  retailer_ids?: number[];
  [key: string]: any; // Index signature
}

export interface IProductCardProps {
  product?: ShopItemDto;
  availableShopIds: number[] | null;
  onPress?: (barcode: string, categoryId: number) => void;
  className?: string;
}

const ProductCardNew2 = ({
  product,
  availableShopIds = [],
  onPress,
  className,
}: IProductCardProps) => {
  const {
    detail: {
      image_url,
      name,
      brand,
      amount,
      barcode,
      unit,
      category: { id: categoryId } = {},
    } = {},
    price = 0,
    discount_price,
  } = { ...product };

  const percentageDiscount = !!discount_price ? "23" : null;

  const { data: { shops = [] } = {} } = useGetShops();

  return (
    // <Link asChild href={`/product/${barcode}`}>
    <Pressable
      className={clsx("w-40 mr-20 last:mr-0 flex-1", className)}
      onPress={() => onPress?.(String(barcode), Number(categoryId))}
      // onPress={() => console.log("prudct")}
    >
      <View className="bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10">
        <Image
          source={{ uri: image_url ? image_url : PLACEHOLDER_PRODUCT_IMAGE }}
          className="w-full h-32 rounded-lg"
          resizeMode="contain"
        />
        <Badge className="absolute top-2 bg-terciary">
          <Text className="text-xs text-primary-foreground">{`${amount} ${unit}`}</Text>
        </Badge>
        {percentageDiscount && (
          <Badge className="absolute top-9 bg-primary">
            <Text className="text-xs">{`${percentageDiscount} %`}</Text>
          </Badge>
        )}
        {/* TODO fix this bottom-16 absolute positioning - find out why bottom is starting from div not image */}
        <View className="absolute bottom-16 flex-row gap-x-2 mt-1">
          {[2, 3]?.map((retailer, index) => (
            <View
              key={retailer}
              style={{ width: 20, height: 20, borderRadius: 50 }}
              //   className="border-2"
            >
              <Image
                {...getShopLogo(retailer as any)}
                key={index}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 50,
                  position: "absolute",
                  right: index * 15,
                  zIndex: index + 1,
                  backgroundColor: "white",
                  borderColor: "grey",
                  borderWidth: 1,
                  //TODO add here some elevation to visually differentiate the shop logos
                }}
              />
            </View>
          ))}
        </View>
        <View className="mt-2 space-y-1">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs text-gray-600" numberOfLines={1}>
                {brand}
              </Text>
              <Text className="text-sm font-medium" numberOfLines={1}>
                {name}
              </Text>
              <Text className="text-sm font-bold">{price} €</Text>
            </View>
            <IconButton>
              <CirclePlus size={20} className="text-sm" />
            </IconButton>
          </View>
        </View>
      </View>
    </Pressable>
    // </Link>
  );
};

export default ProductCardNew2;
