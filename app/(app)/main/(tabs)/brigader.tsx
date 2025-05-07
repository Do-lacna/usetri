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
import { useGetShops } from '../../../../network/query/query';
import {
  displayErrorToastMessage,
  displaySuccessToastMessage,
} from '../../../../utils/toast-utils';

export default function SearchScreen() {
  const queryClient = useQueryClient();
  const [selectedShop, setSelectedShop] = React.useState<Option>({
    value: '',
    label: '',
  });

  const {
    data: { products_to_check = [], calendar_week, created_at } = {},
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
          displaySuccessToastMessage('Cena produktu bola úspešne potvrdená');
        },
        onError: () => {
          console.log('Error');
          displayErrorToastMessage('Nepodarilo sa potvrdiť cenu produktu');
        },
      },
    });
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
      <Link
        href={{
          pathname: '/main/brigader-scan-screen/[...slug]',
          params: { slug: [String(selectedShop?.value)] },
        }}
        asChild
      >
        <Button>
          <Text>Sken nových produktov</Text>
        </Button>
      </Link>

      <Text className="font-bold text-center my-4 text-xl">
        Kalendárny týždeň {calendar_week}, kontrola:
      </Text>

      <FlatList
        data={products_to_check}
        renderItem={({ item }) => (
          <BrigaderProductRow
            product={item}
            onConfirm={(price, is_price_valid) =>
              sendConfirmProductPrice({
                data: {
                  shop_id: Number(selectedShop?.value),
                  barcode: item?.barcode,
                  is_price_valid,
                  new_base_price: !is_price_valid ? price : null,
                },
              })
            }
            shopId={Number(selectedShop?.value)}
          />
        )}
        keyExtractor={(product) => String(product?.barcode)}
        contentContainerClassName="gap-4 px-1 pt-4 pb-40 box-border"
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
