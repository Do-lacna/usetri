/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { ShopExtendedDto } from './shopExtendedDto';
import type { CartComparisonProductDto } from './cartComparisonProductDto';

export interface CartComparisonDto {
  shop?: ShopExtendedDto;
  /** @nullable */
  specific_products?: CartComparisonProductDto[] | null;
  total_price?: number;
  normalized_total_price?: number;
  /** @nullable */
  available_shop_ids?: number[] | null;
}
