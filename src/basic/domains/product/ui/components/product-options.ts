// product/ui/product-ui.ts
// import { type AppState } from "../../../../core/state";
// import * as ProductPolicy from "../../policies";

// interface ProductUIElements {
//   productSelect: HTMLSelectElement | null;
//   stockStatus: HTMLDivElement | null;
// }

// const elements: ProductUIElements = {
//   productSelect: null,
//   stockStatus: null,
// };

// export const initProductUI = (
//   productSelectContainer: HTMLElement,
//   stockStatusContainer: HTMLElement
// ): void => {
//   // 상품 선택 드롭다운
//   elements.productSelect = document.createElement("select");
//   elements.productSelect.id = "product-select";
//   elements.productSelect.className = "border rounded p-2 mr-2";

//   // 재고 상태 표시 영역
//   elements.stockStatus = document.createElement("div");
//   elements.stockStatus.id = "stock-status";
//   elements.stockStatus.className = "text-sm text-gray-500 mt-2";

//   productSelectContainer.appendChild(elements.productSelect);
//   stockStatusContainer.appendChild(elements.stockStatus);
// };

// export const renderProductSelect = (
//   state: AppState,
//   onProductSelect?: (productId: string) => void
// ): void => {
//   if (!elements.productSelect) return;

//   elements.productSelect.innerHTML = "";

//   // 이벤트 핸들러 재설정
//   elements.productSelect.onchange = onProductSelect
//     ? () => onProductSelect(elements.productSelect?.value || "")
//     : null;

//   state.products.forEach((product) => {
//     const option = document.createElement("option");
//     option.value = product.id;
//     option.textContent = `${product.name} - ${product.price}원`;
//     option.disabled = product.stock === 0;

//     elements.productSelect?.appendChild(option);
//   });
// };

// export const renderStockStatus = (state: AppState): void => {
//   if (!elements.stockStatus) return;

//   // 재고 부족 상품 정보
//   const lowStockInfo = ProductPolicy.getLowStockInfo(state.products);
//   elements.stockStatus.textContent = lowStockInfo;
// };

// export const getSelectedProductId = (): string | null => {
//   return elements.productSelect?.value || null;
// };

import { Product } from '../../entities';

interface ProductSelectProps {
  products: Product[];
  selectedId: string | null;
}

export const ProductOptions = ({
  products,
  selectedId,
}: ProductSelectProps): string => {
  return products
    .map(
      (product) =>
        `<option 
          value="${product.id}" 
          ${product.stock === 0 ? 'disabled' : ''} 
          ${product.id === selectedId ? 'selected' : ''}
        >${product.name} - ${product.price}원</option>`
    )
    .join('');
};
