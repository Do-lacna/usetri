/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { ShopItemDto } from './shopItemDto';

export interface ItemListGroupedByBarcodeDto {
  barcode?: number;
  /** @nullable */
  products?: ShopItemDto[] | null;
  /** @nullable */
  available_shop_ids?: number[] | null;
}
