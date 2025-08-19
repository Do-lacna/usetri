import type React from "react";
import { Text, View } from "react-native";
import { getShopById } from "~/lib/utils";
import type { ShopExtendedDto, ShopPriceDto } from "~/network/model";
import { ShopPriceItem } from "./shop-price-item";

interface ShopPricesListProps {
  shopsPrices?: ShopPriceDto[] | null;
  shops: ShopExtendedDto[] | null;
  selectedShopId: number | null;
  onShopSelect: (shopId: number) => void;
}

export const ShopPricesList: React.FC<ShopPricesListProps> = ({
  shopsPrices,
  shops,
  selectedShopId,
  onShopSelect,
}) => {
  if (!shopsPrices || shopsPrices.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Dostupné v {shopsPrices.length} obchodoch
      </Text>

      {shopsPrices.map(({ shop_id, price, discount_price }) => {
        const { name: shopName } = getShopById(Number(shop_id), shops) || {};

        return (
          <ShopPriceItem
            key={shop_id}
            shopId={Number(shop_id)}
            shopName={shopName || "Unknown Shop"}
            price={Number(price)}
            discountPrice={
              discount_price ? Number(discount_price?.price) : null
            }
            isSelected={selectedShopId === shop_id}
            onSelect={onShopSelect}
          />
        );
      })}
    </View>
  );
};
