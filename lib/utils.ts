import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CartDto,
  ProductCartDto,
  ProductDto,
  ShopExtendedDto,
} from "../network/model";
import { BASE_API_URL } from "./constants";

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

export function getShopById(
  shopId: number | null,
  shops: ShopExtendedDto[] | null
) {
  if (!shopId || shops?.length === 0) return null;
  return shops?.find((shop) => shop.id === shopId);
}

export const getSimplifiedCart = (
  cart?: Pick<CartDto, "categories" | "specific_products">
) => {
  if (!cart) return { categories: [], products: [] };
  const category_items = [...(cart?.categories ?? [])].map(
    ({ category: { id } = {}, quantity }) => ({
      category_id: Number(id),
      quantity,
    })
  );
  const product_items = cart?.specific_products?.map(
    ({ product, quantity }) => ({
      barcode: product?.barcode,
      quantity: quantity,
    })
  );

  return {
    category_items,
    product_items,
  };
};

export const getSimplifiedCartAlternative = (cart?: ProductCartDto) => {
  if (!cart) return { items: [] };

  const products = cart?.specific_products?.map(({ product, quantity }) => ({
    barcode: product?.barcode,
    quantity: quantity,
  }));

  return {
    products,
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

export const generateImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return `${BASE_API_URL}${imageUrl}`;
};

export const generateShopLocationNameBasedOnId = (shopId?: number) => {
  switch (shopId) {
    case 1:
      return "Tesco Kamenné námestie";
    case 2:
      return "Billa Muchovo námestie";
    case 3:
      return "Lidl Mamateyova";
    case 4:
      return "Kaufland Petržalka";
    default:
      return "Neznámy obchod";
  }
};
