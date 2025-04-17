import { type AppState } from '../../../core/state';
import * as CartPolicy from '../policies';
import { CartItem } from './components/cart-item';
import { CartTotal } from './components/cart-total';

export const renderCartItems = (state: AppState) => {
  return state.cartItems.map((cartItem) => CartItem({ cartItem })).join('');
};

export const renderCartTotal = (state: AppState) => {
  // 장바구니 계산 결과
  const totals = CartPolicy.calculateCartTotal(state.cartItems);

  // CartTotal 컴포넌트 사용하여 HTML 생성
  return CartTotal({
    subtotal: totals.subtotal,
    finalTotal: totals.finalTotal,
    discountRate: totals.discountRate,
    bonusPoints: state.bonusPoints,
  });
};

/**
 * 특정 카트 아이템의 정보만 업데이트 (전체 렌더링 없이)
 */
export const updateCartItemText = (
  state: AppState,
  productId: string
): void => {
  // 해당 상품 찾기
  const cartItem = state.cartItems.find(
    (cartItem) => cartItem.id === productId
  );
  if (!cartItem) return;

  // 수량 텍스트만 업데이트
  const itemElement = document.getElementById(productId);
  if (itemElement) {
    const spanElement = itemElement.querySelector('span');
    if (spanElement) {
      spanElement.textContent = `${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}`;
    }
  }
};

/**
 * 특정 영역만 업데이트 (재사용 가능한 함수)
 */
export const updateElement = (
  elementId: string,
  renderFunction: (state: AppState) => string,
  state: AppState
): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = renderFunction(state);
  }
};
