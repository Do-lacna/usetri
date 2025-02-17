import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useGetArchivedCart } from "../../../../network/customer/customer";

export default function ArchivedCartScreen() {
  const { id: cartId } = useLocalSearchParams();
  const { data: { archived_carts = [] } = {} } = useGetArchivedCart();

  const selectedArchivedCart = archived_carts?.find(
    ({ cart_id }) => cart_id === Number(cartId)
  );

  if (!selectedArchivedCart) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  const { categories, barcodes, selected_shop_id } = selectedArchivedCart;

  //TODO this will be editted by BE and data will be returned from /archived-cart/${id} EP
  return (
    // <ComparisonShopReceipt
    //   categories={categories}
    //   specific_products={barcodes}
    //   shop={selected_shop_id}
    // />
    <View>
      <Text>Tu je detail nakupu</Text>
    </View>
  );
}
