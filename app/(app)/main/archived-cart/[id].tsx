import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import ReceiptScreen from "../../../../components/ui/carts-comparison/comparison-shop-receipt-alternative";
import { useGetArchivedCartById } from "../../../../network/customer/customer";

export default function ArchivedCartScreen() {
  const { id: cartId } = useLocalSearchParams();
  const { data: { cart } = {} } = useGetArchivedCartById(Number(cartId), {
    query: {
      enabled: !!cartId,
    },
  });

  console.log(cart);

  const mappedProducts = cart?.barcodes?.map(
    ({ price, product, quantity }) => ({
      price,
      detail: product,
      quantity,
    })
  );

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
    // <View className="flex-1 p-4">
    //   <Text>Nákup z {format(String(cart?.created_at), DATE_FORMAT)}</Text>
    //   <Text>Ušetrených {cart?.total_price?.toFixed(2)} eur</Text>

    //   <ComparisonShopReceiptAlt actionsExecutable={false} {...cart} />
    // </View>
    <View className="flex flex-1 align-center justify-center py-4 px-2">
      {/* <ComparisonShopReceipt {...cartData} /> */}
      <ReceiptScreen
        shop={cart?.shop}
        specific_products={mappedProducts}
        total_price={cart?.total_price}
      />
    </View>
  );
}
