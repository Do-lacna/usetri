/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */

export interface ProductImportDto {
  barcode?: number;
  /** @nullable */
  name?: string | null;
  amount?: number;
  /** @nullable */
  brand?: string | null;
  /** @nullable */
  unit?: string | null;
  category_id?: number;
  /** @nullable */
  image_url?: string | null;
  /** @nullable */
  source_image?: string | null;
  is_barcode_checked?: boolean;
}
