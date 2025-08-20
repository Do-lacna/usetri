import clsx from "clsx";
import { Image, Pressable, Text, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../lib/constants";
import type { ShopItemDto, ShopPriceDto } from "../../network/model";
import { useGetShops } from "../../network/query/query";
import { getShopLogo } from "../../utils/logo-utils";

export interface IProductCardProps {
  product?: ShopItemDto;
  shopsPrices?: ShopPriceDto[] | null;
  onPress?: (barcode: string, categoryId: number) => void;
  className?: string;
  isSelected?: boolean;
}

const SuggestedProductCard = ({
  product,
  shopsPrices,
  onPress,
  className,
  isSelected,
}: IProductCardProps) => {
  const {
    detail: {
      name,
      brand,
      barcode,
      unit_dto: {
        normalized_amount: amount = "",
        normalized_unit: unit = "",
      } = {},
      category: { id: categoryId, image_url: categoryImageUrl } = {},
      image_url,
    } = {},
  } = { ...product };

  const { data: { shops = [] } = {} } = useGetShops();

  const lowestPrice = shopsPrices?.[0]?.price ?? 0;

  return (
    <Pressable
      className={clsx("w-32 mr-20 last:mr-0 flex-1", className)}
      onPress={() => onPress?.(String(barcode), Number(categoryId))}
    >
      <View
        className={clsx(
          "bg-gray-50 rounded-xl p-2 shadow-sm shadow-foreground/10",
          isSelected ? "border-2 border-primary" : ""
        )}
      >
        <View className="w-full h-24 rounded-lg relative">
          <Image
            source={{
              uri: image_url ?? categoryImageUrl ?? PLACEHOLDER_PRODUCT_IMAGE,
            }}
            className="w-full h-24 rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
            {shopsPrices?.map((retailer, index) => (
              <View
                key={retailer?.shop_id}
                style={{ width: 18, height: 18, borderRadius: 50 }}
              >
                <Image
                  {...getShopLogo(retailer?.shop_id as any)}
                  key={index}
                  style={{
                    width: 18,
                    height: 18,
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
              <Text className="text-xs text-gray-500">
                {amount} {unit}
              </Text>
            </View>
            <Text className="text-sm font-bold">{lowestPrice} €</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default SuggestedProductCard;
