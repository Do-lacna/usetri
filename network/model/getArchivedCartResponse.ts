/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { ShortArchivedHybridCartDto } from './shortArchivedHybridCartDto';

export interface GetArchivedCartResponse {
  total_price_spared?: number;
  total_price_spared_last_month?: number;
  /** @nullable */
  archived_carts?: ShortArchivedHybridCartDto[] | null;
}
