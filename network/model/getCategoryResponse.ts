/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CategoryExtendedWithPathDto } from './categoryExtendedWithPathDto';

export interface GetCategoryResponse {
  /** @nullable */
  categories?: CategoryExtendedWithPathDto[] | null;
  /** @nullable */
  unsorted_categories?: CategoryExtendedWithPathDto[] | null;
}