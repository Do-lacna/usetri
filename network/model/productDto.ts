/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CategoryExtendedDto } from './categoryExtendedDto';

export interface ProductDto {
  /** @nullable */
  barcode?: string | null;
  category?: CategoryExtendedDto;
  /** @nullable */
  name?: string | null;
  amount?: number;
  /** @nullable */
  brand?: string | null;
  /** @nullable */
  unit?: string | null;
  /** @nullable */
  image_url?: string | null;
}
