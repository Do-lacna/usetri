import { Link } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import BrigaderProductRow from "../../../../components/ui/brigader-product-row";
import { Button } from "../../../../components/ui/button";
import { generateShoppingListItemDescription } from "../../../../lib/utils";
import { useGetProductsAdmin } from "../../../../network/admin/admin";

export default function SearchScreen() {
  const { data: { products = [] } = {}, isPending } = useGetProductsAdmin();

  const first10Products = products?.slice(10);
  const suggestions = first10Products?.map((product) => product?.products?.[0]);
  return (
    <View className="flex justify-start px-2">
      <Link href="/main/scan/brigader-scan-screen" asChild>
        <Button>
          <Text>Skenuj produkty</Text>
        </Button>
      </Link>

      <FlatList
        data={suggestions}
        renderItem={({
          item: {
            detail: { name = "", brand = "", unit = "", amount = 0 } = {},
          } = {},
        }) => (
          <BrigaderProductRow
            label={name}
            description={generateShoppingListItemDescription({
              brand,
              unit,
              amount,
            })}
          />
        )}
        keyExtractor={(product) => String(product?.detail?.barcode)}
        contentContainerClassName="gap-4 px-1 pt-4 pb-10"
      />
    </View>
  );
}
