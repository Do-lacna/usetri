// Type definitions
type PriceValue = number | string | { price: number | string };

/**
 * Calculates the discount percentage between an original price and a discounted price
 * @param originalPrice - The original price (can be number, string, or object with price property)
 * @param discountedPrice - The discounted price (can be number, string, or object with price property)
 * @returns The discount percentage rounded to nearest integer, or null if invalid
 */
export const calculateDiscountPercentage = (
  originalPrice: PriceValue,
  discountedPrice?: PriceValue,
): number | null => {
  if (!originalPrice || !discountedPrice) return null;

  // Handle different input types - extract numeric values
  const getNumericValue = (value: PriceValue): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number.parseFloat(value);
    if (typeof value === 'object' && value.price !== undefined) {
      return Number.parseFloat(String(value.price));
    }
    return Number.NaN;
  };

  const original = getNumericValue(originalPrice);
  const discounted = getNumericValue(discountedPrice);

  // Validate that we have valid numbers and discount makes sense
  if (
    Number.isNaN(original) ||
    Number.isNaN(discounted) ||
    original <= 0 ||
    discounted >= original
  ) {
    return null;
  }

  return Math.round(((original - discounted) / original) * 100);
};
