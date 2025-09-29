import { useEffect, useState } from "react";
import { isArrayNotEmpty } from "../../../lib/utils";
import type { ShopExtendedDto } from "../../../network/model";
import {
  useGetDiscountsStatistics,
  useGetShops,
} from "../../../network/query/query";
import { sortShopsByDiscountCount } from "../utils/store-utils";

export const useStoreSelection = () => {
  const { data: { shops } = {}, isLoading: areShopsLoading } = useGetShops();
  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  );

  const sortedShops =
    shops && stats ? sortShopsByDiscountCount(shops, stats) : [];

  useEffect(() => {
    if (isArrayNotEmpty(shops) && isArrayNotEmpty(stats) && !activeStoreId) {
      const sorted = sortShopsByDiscountCount(shops, stats);
      setActiveStoreId(Number(sorted?.[0]?.id));
    }
  }, [shops, stats, activeStoreId]);

  const handleStoreSelect = (storeId: number) => {
    setActiveStoreId(storeId);
  };

  const handleSnapToItem = (index: number) => {
    const store = sortedShops?.[index];
    if (store) {
      setActiveStoreId(Number(store.id));
    }
  };

  return {
    activeStoreId,
    activeStore,
    sortedShops,
    handleStoreSelect,
    handleSnapToItem,
  };
};
