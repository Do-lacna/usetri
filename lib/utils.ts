import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
