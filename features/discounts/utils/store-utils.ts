import type { DiscountStatsDto } from "../../../network/model";

export const getStoreDiscountsCount = (
  storeId: number,
  stats: DiscountStatsDto[] | null
): number => {
  return (
    stats?.find((stat) => stat.shop_id === storeId)?.valid_discounts_count || 0
  );
};

export const getStoreDisplayName = (storeName?: string | null): string => {
  if (!storeName) return "Store";
  const name = storeName.toLowerCase();
  if (name.includes("billa")) return "Billa";
  if (name.includes("kaufland")) return "Kaufland";
  if (name.includes("lidl")) return "Lidl";
  if (name.includes("tesco")) return "Tesco";
  return storeName;
};

export const sortShopsByDiscountCount = (
  shops: any[],
  stats: DiscountStatsDto[]
) => {
  return shops?.sort(
    ({ id: firstStoreId = 0 }, { id: secondStoreId = 0 }) =>
      getStoreDiscountsCount(secondStoreId, stats) -
      getStoreDiscountsCount(firstStoreId, stats)
  );
};
