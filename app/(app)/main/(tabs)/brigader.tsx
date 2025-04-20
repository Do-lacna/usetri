import { Option } from "@rn-primitives/select";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrigaderProductRow from "../../../../components/ui/brigader-product-row";
import { Button } from "../../../../components/ui/button";
import {
  CustomSelect,
  SelectOptionType,
} from "../../../../components/ui/custom-select/custom-select";
import { generateShoppingListItemDescription } from "../../../../lib/utils";
import { useGetProductsAdmin } from "../../../../network/admin/admin";
import { useGetShops } from "../../../../network/query/query";

export default function SearchScreen() {
  const [selectedShop, setSelectedShop] = React.useState<Option>({
    value: "",
    label: "",
  });
  const { data: { products = [] } = {}, isPending } = useGetProductsAdmin();

  const { data: { shops = [] } = {}, isPending: areShopsLoading } =
    useGetShops();

  const first10Products = products?.slice(10);
  const suggestions = first10Products?.map((product) => product?.products?.[0]);

  const mappedShops = useMemo(
    () =>
      shops?.map((shop) => ({
        label: shop?.name,
        value: String(shop?.id),
        icon: shop?.image_url,
      })),
    [shops]
  ) as SelectOptionType[];

  console.log(selectedShop?.label);

  React.useEffect(() => {
    if (mappedShops?.length > 0) {
      setSelectedShop(mappedShops?.[0]);
    }
  }, [mappedShops]);

  return (
    <SafeAreaView className="flex justify-start px-2">
      <CustomSelect
        label="Dostupné obchody"
        options={mappedShops}
        defaultValue={mappedShops?.[0]}
        onChange={setSelectedShop}
        selectClassName="w-full my-4"
      />
      <Link href={`/main/brigader-scan-screen/${selectedShop?.value}`} asChild>
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
    </SafeAreaView>
  );
}
