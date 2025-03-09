/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CartCategoryDto } from './cartCategoryDto';
import type { ProductDto } from './productDto';
import type { ShopExtendedDto } from './shopExtendedDto';

export interface ArchivedCartDto {
  cart_id?: number;
  /** @nullable */
  owner_id?: string | null;
  /** @nullable */
  categories?: CartCategoryDto[] | null;
  /** @nullable */
  barcodes?: ProductDto[] | null;
  created_at?: string;
  shop?: ShopExtendedDto;
  total_price?: number;
  price_difference?: number;
}
