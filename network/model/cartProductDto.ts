/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { ProductDto } from './productDto';

export interface CartProductDto {
  product?: ProductDto;
  quantity?: number;
  price?: number;
  total_price?: number;
  /** @nullable */
  available_shop_ids?: number[] | null;
}
