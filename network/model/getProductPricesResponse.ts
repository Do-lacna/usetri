/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { DiscountPriceDto } from './discountPriceDto';
import type { PriceDto } from './priceDto';

export interface GetProductPricesResponse {
  current_discount?: DiscountPriceDto;
  current_price?: PriceDto;
  /** @nullable */
  discount_history?: DiscountPriceDto[] | null;
  /** @nullable */
  price_history?: PriceDto[] | null;
}
