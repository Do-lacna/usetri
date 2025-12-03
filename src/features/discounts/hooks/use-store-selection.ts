import { useEffect, useMemo, useState } from "react";
import { Animated } from "react-native";
import type { ShopExtendedDto } from "~/src/network/model";
import {
  useGetDiscountsStatistics,
  useGetShops,
} from "~/src/network/query/query";
import { sortShopsByDiscountCount } from "../utils/store-utils";

export const useStoreSelection = (scrollY?: Animated.Value) => {
  const { data: { shops } = {} } = useGetShops();
  const { data: { stats = [] } = {}, isLoading: areDiscountStatisticsLoading } =
    useGetDiscountsStatistics();
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  const activeStore = shops?.find(
    (store: ShopExtendedDto) => store.id === activeStoreId
  );

  const sortedShops = useMemo(() => {
    return shops && stats ? sortShopsByDiscountCount(shops, stats) : [];
  }, [shops, stats]);

  useEffect(() => {
    if (
      !activeStoreId &&
      !areDiscountStatisticsLoading &&
      sortedShops.length > 0
    ) {
      setActiveStoreId(Number(sortedShops[0]?.id));
    }
  }, [sortedShops, activeStoreId, areDiscountStatisticsLoading]);

  const handleStoreSelect = (storeId: number) => {
    setActiveStoreId(storeId);
  };

  const handleSnapToItem = (index: number) => {
    const store = sortedShops?.[index];
    if (store) {
      setActiveStoreId(Number(store.id));

      if (scrollY) {
        Animated.timing(scrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
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
