import { Option } from '@rn-primitives/select';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getGetProductsForBrigaderQueryKey,
  useCheckItemInReviewList,
  useGetProductsForBrigader,
} from '~/network/brigader/brigader';
import BrigaderProductRow from '../../../../components/ui/brigader-product-row';
import { Button } from '../../../../components/ui/button';
import {
  CustomSelect,
  SelectOptionType,
} from '../../../../components/ui/custom-select/custom-select';
import { generateShoppingListItemDescription } from '../../../../lib/utils';
import { useGetShops } from '../../../../network/query/query';

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const [selectedShop, setSelectedShop] = React.useState<Option>({
    value: '',
    label: '',
  });

  const {
    data: { products_to_check = [] } = {},
    isLoading: areProductsLoading,
  } = useGetProductsForBrigader(
    { shop_id: Number(selectedShop?.value) },
    { query: { enabled: !!selectedShop?.value } },
  );
  const { mutate: sendConfirmProductPrice, isPending: isConfirmingPrice } =
    useCheckItemInReviewList({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetProductsForBrigaderQueryKey(),
          });
          console.log('Success');
        },
      },
    });
  console.log(products_to_check);
  const {
    data: { shops = [] } = {},
    isPending: areShopsLoading,
  } = useGetShops();

  const mappedShops = useMemo(
    () =>
      shops?.map((shop) => ({
        label: shop?.name,
        value: String(shop?.id),
        icon: shop?.image_url,
      })),
    [shops],
  ) as SelectOptionType[];

  React.useEffect(() => {
    if (mappedShops?.length > 0) {
      setSelectedShop(mappedShops?.[0]);
    }
  }, [mappedShops]);

  const isLoading = areProductsLoading || areShopsLoading || isConfirmingPrice;

  return (
    <SafeAreaView className="flex justify-start px-2">

      <CustomSelect
        label="Dostupné obchody"
        options={mappedShops}
        defaultValue={mappedShops?.[0]}
        onChange={setSelectedShop}
        selectClassName="w-full my-4"
      />
      <Link href={{
        pathname: '/main/brigader-scan-screen/[...slug]',
        params: { slug: [String(selectedShop?.value)] },
      }} asChild>
        <Button>
          <Text>Skenuj produkty</Text>
        </Button>
      </Link>

      <FlatList
        data={[
          {
            price: 12,
            detail: {
              name: 'test',
              brand: 'test',
              unit: 'ks',
              amount: 0,
              barcode: '123',
            },
          },
        ]}
        renderItem={({
          item: {
            price,
            detail: { name = '', brand = '', unit = '', amount = 0, barcode } = {},
          } = {},
        }) => (
          <BrigaderProductRow
            label={name}
            description={generateShoppingListItemDescription({
              brand,
              unit,
              amount,
            })}
            price={price}
            onConfirm={() =>
              sendConfirmProductPrice({
                data: { shop_id: Number(selectedShop?.value), barcode: 123 },
              })
            }
            shopId={Number(selectedShop?.value)}
            barcode={barcode}
          />
        )}
        keyExtractor={(product) => String(product?.detail?.barcode)}
        contentContainerClassName="gap-4 px-1 pt-4 pb-10"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => queryClient.invalidateQueries()}
          />
        }
      />
    </SafeAreaView>
  );
}
