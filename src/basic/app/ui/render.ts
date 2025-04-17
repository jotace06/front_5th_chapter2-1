import { AppState } from '../../core/state';
import * as ProductUI from '../../domains/product/ui/render';
import * as CartUI from '../../domains/cart/ui/render';

interface EventHandlers {
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

// DOM 요소 참조 보관
const elements = {
  container: null as HTMLElement | null,
  cartItems: null as HTMLElement | null,
  cartTotal: null as HTMLElement | null,
  productSelect: null as HTMLElement | null,
  stockStatus: null as HTMLElement | null,
  addButton: null as HTMLButtonElement | null,
};

// 이벤트 핸들러 참조 보관
let handlers: EventHandlers | null = null;

/**
 * 최초 UI 초기화 - 레이아웃 생성 및 이벤트 바인딩
 */
export const initUI = (
  $container: HTMLElement,
  initialState: AppState,
  eventHandlers: EventHandlers
): void => {
  if (!$container) return;

  elements.container = $container;
  handlers = eventHandlers;

  // 기본 레이아웃 생성 (한 번만 실행)
  createLayout();

  // 이벤트 바인딩 (한 번만 실행)
  bindEvents();

  // 초기 상태로 UI 업데이트
  updateContent(initialState);
};

/**
 * 기본 레이아웃 생성 (정적 구조)
 */
const createLayout = (): void => {
  if (!elements.container) return;

  // 최상위 컨테이너
  const wrapper = document.createElement('div');
  wrapper.className = 'bg-gray-100 p-8';

  // 내부 컨테이너
  const innerWrapper = document.createElement('div');
  innerWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  // 제목 요소
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';

  // 장바구니 아이템 컨테이너
  const cartItems = document.createElement('div');
  cartItems.id = 'cart-items';
  elements.cartItems = cartItems;

  // 장바구니 합계 컨테이너
  const cartTotal = document.createElement('div');
  cartTotal.id = 'cart-total';
  cartTotal.className = 'text-xl font-bold my-4';
  elements.cartTotal = cartTotal;

  // 상품 선택 드롭다운
  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className = 'border rounded p-2 mr-2';
  elements.productSelect = productSelect;

  // 추가 버튼
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButton.textContent = '추가';
  elements.addButton = addButton;

  // 재고 상태 표시 영역
  const stockStatus = document.createElement('div');
  stockStatus.id = 'stock-status';
  stockStatus.className = 'text-sm text-gray-500 mt-2';
  elements.stockStatus = stockStatus;

  // 요소 조립 (원본 코드와 동일한 순서)
  innerWrapper.appendChild(title);
  innerWrapper.appendChild(cartItems);
  innerWrapper.appendChild(cartTotal);
  innerWrapper.appendChild(productSelect);
  innerWrapper.appendChild(addButton);
  innerWrapper.appendChild(stockStatus);
  wrapper.appendChild(innerWrapper);
  elements.container.appendChild(wrapper);
};

/**
 * 이벤트 바인딩 (한 번만 실행)
 */
const bindEvents = (): void => {
  if (!handlers || !elements.container) return;

  // 이벤트 위임을 사용하여 상위 컨테이너에 이벤트 리스너 등록
  elements.container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // 상품 추가 버튼 클릭
    if (target.id === 'add-to-cart') {
      const productId = ProductUI.getSelectedProductId();
      if (productId) {
        handlers?.onAddToCart(productId);
      }
    }

    // 수량 변경 버튼 클릭
    if (target.classList.contains('quantity-change')) {
      const productId = target.dataset.productId;
      const change = parseInt(target.dataset.change || '0');

      if (productId && !isNaN(change)) {
        handlers?.onUpdateQuantity(productId, change);
      }
    }

    // 삭제 버튼 클릭
    if (target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      if (productId) {
        handlers?.onRemoveItem(productId);
      }
    }
  });
};

export type Options = { partialUpdate?: boolean; targetId?: string };

/**
 * 동적 콘텐츠 업데이트 (상태 변경 시 호출)
 */
const updateContent = (state: AppState, options?: Options): void => {
  if (
    !elements.cartItems ||
    !elements.cartTotal ||
    !elements.productSelect ||
    !elements.addButton ||
    !elements.stockStatus
  ) {
    return;
  }

  // 부분 업데이트 모드인 경우 (수량 변경)
  if (options?.partialUpdate && options.targetId) {
    // 특정 아이템만 업데이트
    CartUI.updateCartItemText(state, options.targetId);

    // 합계 업데이트 (항상 필요)
    elements.cartTotal.innerHTML = CartUI.renderCartTotal(state);

    // 상품 선택 드롭다운 업데이트
    elements.productSelect.innerHTML = ProductUI.renderProductOptions(state);

    // 재고 상태 업데이트 (필요한 경우)
    elements.stockStatus.innerHTML = ProductUI.renderStockStatus(state);

    return;
  }

  elements.cartItems.innerHTML = CartUI.renderCartItems(state);

  elements.cartTotal.innerHTML = CartUI.renderCartTotal(state);

  elements.productSelect.innerHTML = ProductUI.renderProductOptions(state);

  elements.stockStatus.innerHTML = ProductUI.renderStockStatus(state);
};
/**
 * 외부에서 호출하는 UI 업데이트 함수
 */
export const updateUI = (
  $container: HTMLElement | null,
  state: AppState,
  eventHandlers: EventHandlers,
  options?: Options
): void => {
  // 초기화되지 않은 경우 초기화 진행
  if (!elements.container && $container) {
    initUI($container, state, eventHandlers);
    return;
  }

  // 이미 초기화된 경우 콘텐츠만 업데이트
  updateContent(state, options);
};
