import type React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PLACEHOLDER_PRODUCT_IMAGE } from "../../lib/constants";
import { calculateDiscountPercentage } from "../../lib/number-utils";
import type { ShopItemDto, ShopPriceDto } from "../../network/model";
import StoreLogo from "../store-logo/store-logo";

// Types
interface Shop {
  id: string;
  name: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  availableShops: Shop[];
}

interface ProductCardProps {
  product: ShopItemDto;
  shopsPrices?: ShopPriceDto[] | null;
  onPress?: (barcode: string) => void;
}

const DiscountedMiniProductCard: React.FC<ProductCardProps> = ({
  product,
  shopsPrices,
  onPress,
}) => {
  const { price, detail: { image_url, name, barcode } = {}, shop_id } = product;

  const lowestPrice = shopsPrices?.[0]?.price ?? 0;
  const lowestDiscountedPrice = shopsPrices?.[0]?.discount_price?.price ?? 0;

  return (
    <Pressable
      className="bg-card rounded-lg p-2 mx-2 shadow-sm border border-border w-32"
      onPress={() => onPress?.(String(barcode))}
    >
      {/* Discount Badge */}
      <View className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1 z-10">
        <Text className="text-white text-xs font-bold">
          -
          {calculateDiscountPercentage(
            Number(lowestPrice),
            lowestDiscountedPrice
          )}
          %
        </Text>
      </View>

      {/* Product Image */}
      <View className="w-full h-16 rounded-lg relative">
        <Image
          source={{ uri: image_url ?? PLACEHOLDER_PRODUCT_IMAGE }}
          className="w-full h-16 rounded-md mb-2"
          resizeMode="cover"
        />

        <View className="absolute bottom-1 flex-row gap-x-2 mt-1">
          {/* {TODO add all available shops from BE} */}
          {shopsPrices?.map(({ shop_id }, index) => (
            <View
              key={shop_id}
              style={{ width: 15, height: 15, borderRadius: 50 }}
            >
              <StoreLogo
                storeId={shop_id}
                containerStyle={{
                  width: 15,
                  height: 15,
                  borderRadius: 50,
                  position: "absolute",
                  right: index * 12,
                  zIndex: index + 1,
                  backgroundColor: "white",
                  borderColor: "#D1D5DB",
                  borderWidth: 1,
                }}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Product Name */}
      <Text
        className="text-card-foreground text-xs font-medium mb-1 leading-4"
        numberOfLines={1}
      >
        {name}
      </Text>

      {/* Price Information */}
      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground text-xs line-through">
          {lowestPrice?.toFixed(2)} €
        </Text>
        <Text className="text-red-600 text-xs font-bold">
          {lowestDiscountedPrice?.toFixed(2)} €
        </Text>
      </View>
    </Pressable>
  );
};

export default DiscountedMiniProductCard;
