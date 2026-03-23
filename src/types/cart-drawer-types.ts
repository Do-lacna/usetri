/**
 * Shared cart drawer types — extracted here to break the circular dependency
 * between shopping-list.tsx and pending-cart-item-drawer-content components.
 */

export enum CartOperationsEnum {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

export enum DrawerTypeEnum {
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

export type PendingCartDataType = {
  identifier: number;
  type: DrawerTypeEnum;
  source?: 'product_detail_category_prices_grid';
};
