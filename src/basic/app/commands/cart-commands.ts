import { type AppState } from '../../core/state';
import { CartItem } from '../../domains/cart/entities/cart-item';
import * as CartPolicy from '../../domains/cart/policies';
import * as CartService from '../../domains/cart/services';
import * as ProductService from '../../domains/product/services';

/**
 * 장바구니에 상품 추가 및 재고 업데이트
 * Command 계층에서 서비스 간 조율 담당
 */
export const addToCart = (
  state: AppState,
  productId: CartItem['id']
): AppState => {
  try {
    // 장바구니에 상품 추가 (장바구니 관련 작업만)
    const updatedCart = CartService.addToCart(
      state.products,
      state.cartItems,
      productId
    );

    // 재고 업데이트 (상품 관련 작업)
    const updatedProducts = ProductService.updateProductsStock(
      state.products,
      productId,
      -1
    );

    // 장바구니 계산 결과 반영 (비즈니스 규칙 적용)
    const policyResult = CartPolicy.calculateCartTotal(updatedCart);

    // 상태 업데이트 및 반환
    return {
      ...state,
      products: updatedProducts,
      cartItems: updatedCart,
      lastSelected: productId,
      bonusPoints: policyResult.bonusPoints,
    };
  } catch (error) {
    alert(error.message);
    return state;
  }
};

/**
 * 장바구니 상품 수량 증가
 */
export const increaseCartItemQuantity = (
  state: AppState,
  productId: CartItem['id']
): AppState => {
  try {
    // 장바구니 상품 수량 증가 (장바구니 관련 작업) - 항상 1 증가
    const updatedCart = CartService.changeCartItemQuantity(
      state.cartItems,
      state.products,
      productId,
      1
    );

    // 재고 업데이트 (상품 관련 작업)
    const updatedProducts = ProductService.updateProductsStock(
      state.products,
      productId,
      -1
    );

    // 장바구니 계산 결과 (비즈니스 규칙 적용)
    const policyResult = CartPolicy.calculateCartTotal(updatedCart);

    // 상태 업데이트 및 반환
    return {
      ...state,
      products: updatedProducts,
      cartItems: updatedCart,
      bonusPoints: policyResult.bonusPoints,
    };
  } catch (error) {
    alert(error.message);
    return state;
  }
};

/**
 * 장바구니 상품 수량 감소
 * 상품 수량을 1개 감소시킵니다.
 */
export const decreaseCartItemQuantity = (
  state: AppState,
  productId: CartItem['id']
): AppState => {
  try {
    // 장바구니 상품 수량 감소
    const updatedCart = CartService.changeCartItemQuantity(
      state.cartItems,
      state.products,
      productId,
      -1
    );

    // 재고 업데이트
    const updatedProducts = ProductService.updateProductsStock(
      state.products,
      productId,
      1
    );

    // 장바구니 계산 결과
    const policyResult = CartPolicy.calculateCartTotal(updatedCart);

    // 상태 업데이트 및 반환
    return {
      ...state,
      products: updatedProducts,
      cartItems: updatedCart,
      bonusPoints: policyResult.bonusPoints,
    };
  } catch (error) {
    alert(error.message);
    return state;
  }
};

/**
 * 장바구니에서 상품 제거
 */
export const removeFromCart = (
  state: AppState,
  productId: CartItem['id']
): AppState => {
  try {
    // 장바구니에서 상품 제거 (장바구니 관련 작업)
    const updatedCart = CartService.removeFromCart(state.cartItems, productId);

    // 재고 복구 (상품 관련 작업)
    const updatedProducts = ProductService.updateProductsStock(
      state.products,
      productId,
      1
    );

    // 장바구니 계산 결과 (비즈니스 규칙 적용)
    const policyResult = CartPolicy.calculateCartTotal(updatedCart);

    // 상태 업데이트 및 반환
    return {
      ...state,
      products: updatedProducts,
      cartItems: updatedCart,
      bonusPoints: policyResult.bonusPoints,
    };
  } catch (error) {
    alert(error.message);
    return state;
  }
};
