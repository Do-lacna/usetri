/**
 * Generated by orval v7.4.1 🍺
 * Do not edit manually.
 * Dolacna.Backend.Api
 * OpenAPI spec version: 1.0
 */
import type { ShopItemDto } from './shopItemDto';
import type { ProductDto } from './productDto';
import type { ShopPriceDto } from './shopPriceDto';

export interface GetProductsByBarcodeQueryResponse {
  /**
   * @deprecated
   * @nullable
   */
  products?: ShopItemDto[] | null;
  detail?: ProductDto;
  /** @nullable */
  shops_prices?: ShopPriceDto[] | null;
}
