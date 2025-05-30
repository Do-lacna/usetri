/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { CategoryDto } from './categoryDto';
import type { ProductDto } from './productDto';
import type { ProductsGroupedByUnits } from './productsGroupedByUnits';

export interface GetCategoryManagementAdminResponse {
  /** @nullable */
  uncategorized_subtrees?: CategoryDto[] | null;
  /** @nullable */
  all_products_with_not_leaf_category?: ProductDto[][] | null;
  /** @nullable */
  products_with_not_set_category?: ProductDto[] | null;
  /** @nullable */
  products_in_same_category_with_different_units?:
    | ProductsGroupedByUnits[]
    | null;
}
