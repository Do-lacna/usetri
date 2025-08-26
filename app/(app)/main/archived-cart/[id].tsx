import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import SavedCartReceiptView from "../../../../components/carts-comparison/profile/saved-cart-receipt-view";
import { getShopById } from "../../../../lib/utils";
import { useGetArchivedCartById } from "../../../../network/customer/customer";
import { useGetShops } from "../../../../network/query/query";

export default function ArchivedCartScreen() {
  const { id: cartId } = useLocalSearchParams();
  const { data: { cart: { shop_id, barcodes = [] } = {}, cart } = {} } =
    useGetArchivedCartById(Number(cartId), {
      query: {
        enabled: !!cartId,
      },
    });

  const { data: { shops = [] } = {} } = useGetShops();

  const mappedProducts = barcodes?.map(({ price, detail, quantity }) => ({
    price,
    detail,
    quantity,
  }));

  const shop = getShopById(Number(shop_id), shops);

  if (!cart || !shop) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return (
    <View className="flex flex-1 align-center justify-center py-4 px-2">
      <SavedCartReceiptView
        shop={shop}
        specific_products={mappedProducts}
        total_price={cart?.total_price}
        actionsExecutable={false}
      />
    </View>
  );
}
