import { useEffect, useState } from "react";
import { isArrayNotEmpty } from "../../../lib/utils";
import type { DiscountStatsDto, ShopExtendedDto } from "../../../network/model";
import { sortShopsByDiscountCount } from "../utils/store-utils";

export const useStoreSelection = (
  shops: ShopExtendedDto[] | undefined,
  stats: DiscountStatsDto[]
) => {
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  );

  console.log("Stattts", stats);

  const sortedShops = shops ? sortShopsByDiscountCount(shops, stats) : [];

  useEffect(() => {
    if (isArrayNotEmpty(shops) && !activeStoreId) {
      const sorted = sortShopsByDiscountCount(shops, stats);
      console.log("Stattts", stats);
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
