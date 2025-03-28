import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartDto, ProductDto, ShopExtendedDto } from "../network/model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if an array is NOT null, undefined, or empty.
 * @param arr - The array to check.
 * @returns `true` if the array is valid and not empty; otherwise, `false`.
 */
export function isArrayNotEmpty<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

export function getShopIcon(shopId: number, shops: ShopExtendedDto[]) {
  if (!shopId || shops?.length === 0) return null;
  return shops.find((shop) => shop.id === shopId)?.image_url;
}

export function getShopById(shopId: number, shops: ShopExtendedDto[]) {
  if (!shopId || shops?.length === 0) return null;
  return shops.find((shop) => shop.id === shopId);
}

export const getSimplifiedCart = (
  cart?: Pick<CartDto, "categories" | "specific_products">
) => {
  if (!cart) return { category_ids: [], barcodes: [] };
  const categoryIds = [...(cart?.categories ?? [])].map(
    ({ category: { id } = {} }) => Number(id)
  );
  const barcodes = cart?.specific_products?.map((product) =>
    String(product?.barcode)
  );

  return {
    category_ids: categoryIds,
    barcodes: barcodes,
  };
};

export const getNumberOfCartItems = (
  cart?: Pick<CartDto, "categories" | "specific_products">
) => {
  if (!cart) return 0;

  return (
    (cart.categories?.length ?? 0) + (cart?.specific_products?.length ?? 0)
  );
};

export const generateShoppingListItemDescription = ({
  amount = 0,
  unit = "[Unit]",
  brand = "[Brand]",
}: Pick<ProductDto, "unit" | "brand" | "amount">) => {
  return `${brand} - ${amount} ${unit}`;
};
