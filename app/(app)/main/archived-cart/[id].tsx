import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import ComparisonShopReceipt from "../../../../components/ui/carts-comparison/comparison-shop-receipt";
import { DATE_FORMAT } from "../../../../lib/constants";
import { useGetArchivedCartById } from "../../../../network/customer/customer";

export default function ArchivedCartScreen() {
  const { id: cartId } = useLocalSearchParams();
  const { data: { cart } = {} } = useGetArchivedCartById(Number(cartId), {
    query: {
      enabled: !!cartId,
    },
  });

  if (!cart) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return (
    // <ComparisonShopReceipt
    //   categories={categories}
    //   specific_products={barcodes}
    //   shop={selected_shop_id}
    // />
    <View className="flex-1 p-4">
      <Text>Nákup z {format(String(cart?.created_at), DATE_FORMAT)}</Text>
      <Text>Ušetrených {cart?.total_price?.toFixed(2)} eur</Text>

      <ComparisonShopReceipt actionsExecutable={false} {...cart} />
    </View>
  );
}
