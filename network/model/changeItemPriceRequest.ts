/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { DiscountPriceDto } from './discountPriceDto';

export interface ChangeItemPriceRequest {
  /** @nullable */
  price?: number | null;
  discount_price?: DiscountPriceDto;
  /** @nullable */
  location?: string | null;
}
