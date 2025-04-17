// domains/product/ui/render.ts
import { AppState } from '../../../core/state';
import { ProductOptions } from './components/product-options';
import { StockStatus } from './components/stock-status';

export const renderProductOptions = (state: AppState): string => {
  return /*html*/ `${ProductOptions({ products: state.products, selectedId: state.lastSelected })}`;
};

export const renderStockStatus = (state: AppState): string => {
  return /*html*/ `${StockStatus({ products: state.products })}`;
};

// 선택된 상품 ID 조회 헬퍼 함수 (이벤트 핸들링을 위해 exports)
export const getSelectedProductId = (): string | null => {
  const selectElement = document.getElementById(
    'product-select'
  ) as HTMLSelectElement;
  return selectElement?.value || null;
};
