/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { DiscountPriceDto } from './discountPriceDto';
import type { ProductDto } from './productDto';

export interface AddProductRequest {
  discount_price?: DiscountPriceDto;
  price?: number;
  product?: ProductDto;
  shop_id?: number;
}
