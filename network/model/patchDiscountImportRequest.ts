/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { DiscountImportActionEnum } from './discountImportActionEnum';

export interface PatchDiscountImportRequest {
  action?: DiscountImportActionEnum;
  /** @nullable */
  barcode?: string | null;
  /** @nullable */
  adjusted_discount_price?: number | null;
  /** @nullable */
  adjusted_percentage_discount?: number | null;
}
