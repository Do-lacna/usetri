/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CategoryDto } from './categoryDto';
import type { ProductDto } from './productDto';

export interface CartCategoryDto {
  category?: CategoryDto;
  cheapest?: ProductDto;
  quantity?: number;
  price?: number;
  total_price?: number;
  /** @nullable */
  available_shop_ids?: number[] | null;
}
