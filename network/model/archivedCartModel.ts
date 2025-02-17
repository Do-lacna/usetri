/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CartCategoryModel } from './cartCategoryModel';
import type { ShopItemDto } from './shopItemDto';
import type { ShopExtendedDto } from './shopExtendedDto';

export interface ArchivedCartModel {
  cart_id?: number;
  /** @nullable */
  owner_id?: string | null;
  /** @nullable */
  categories?: CartCategoryModel[] | null;
  /** @nullable */
  barcodes?: ShopItemDto[] | null;
  created_at?: string;
  selected_shop_id?: ShopExtendedDto;
  total_price?: number;
  price_difference?: number;
}
