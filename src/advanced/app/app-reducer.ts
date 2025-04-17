import { AppState } from './app-state';
import * as CartService from '../domains/cart/services/cart-services';
import * as CartPolicy from '../domains/cart/policies/cart-policies';
import * as ProductService from '../domains/product/services/product-services';

export enum ActionType {
  ADD_TO_CART = 'ADD_TO_CART',
  INCREASE_QUANTITY = 'INCREASE_QUANTITY',
  DECREASE_QUANTITY = 'DECREASE_QUANTITY',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  APPLY_FLASH_SALE = 'APPLY_FLASH_SALE',
  APPLY_RECOMMENDATION = 'APPLY_RECOMMENDATION',
}

interface AddToCartAction {
  type: ActionType.ADD_TO_CART;
  payload: { productId: string };
}

interface IncreaseQuantityAction {
  type: ActionType.INCREASE_QUANTITY;
  payload: { productId: string };
}

interface DecreaseQuantityAction {
  type: ActionType.DECREASE_QUANTITY;
  payload: { productId: string };
}

interface RemoveFromCartAction {
  type: ActionType.REMOVE_FROM_CART;
  payload: { productId: string };
}

interface ApplyFlashSaleAction {
  type: ActionType.APPLY_FLASH_SALE;
  payload: { productId: string; discountRate: number };
}

interface ApplyRecommendationAction {
  type: ActionType.APPLY_RECOMMENDATION;
  payload: { productId: string; discountRate: number };
}

export type Action =
  | AddToCartAction
  | IncreaseQuantityAction
  | DecreaseQuantityAction
  | RemoveFromCartAction
  | ApplyFlashSaleAction
  | ApplyRecommendationAction;

export const appReducer = (state: AppState, action: Action): AppState => {
  try {
    switch (action.type) {
      case ActionType.ADD_TO_CART: {
        const { productId } = action.payload;

        // 장바구니에 상품 추가
        const updatedCart = CartService.addToCart(
          state.products,
          state.cartItems,
          productId
        );

        // 재고 업데이트
        const updatedProducts = ProductService.updateProductsStock(
          state.products,
          productId,
          -1
        );

        // 장바구니 계산 결과
        const policyResult = CartPolicy.calculateCartTotal(updatedCart);

        // 상태 업데이트 및 반환
        return {
          ...state,
          products: updatedProducts,
          cartItems: updatedCart,
          lastSelected: productId,
          bonusPoints: policyResult.bonusPoints,
        };
      }

      case ActionType.INCREASE_QUANTITY: {
        const { productId } = action.payload;

        // 수량 증가
        const updatedCart = CartService.changeCartItemQuantity(
          state.cartItems,
          state.products,
          productId,
          1
        );

        // 재고 업데이트
        const updatedProducts = ProductService.updateProductsStock(
          state.products,
          productId,
          -1
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
      }

      case ActionType.DECREASE_QUANTITY: {
        const { productId } = action.payload;

        // 수량 감소
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
      }

      case ActionType.REMOVE_FROM_CART: {
        const { productId } = action.payload;

        // 장바구니 아이템 찾기
        const cartItem = CartService.findCartItem(state.cartItems, productId);

        if (!cartItem) {
          return state;
        }

        // 장바구니에서 상품 제거
        const updatedCart = CartService.removeFromCart(
          state.cartItems,
          productId
        );

        // 재고 복구
        const updatedProducts = ProductService.updateProductsStock(
          state.products,
          productId,
          cartItem.quantity
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
      }

      case ActionType.APPLY_FLASH_SALE: {
        const { productId, discountRate } = action.payload;

        // 할인 적용
        const updatedProducts = ProductService.applyDiscountToProducts(
          state.products,
          [productId],
          discountRate
        );

        return {
          ...state,
          products: updatedProducts,
        };
      }

      case ActionType.APPLY_RECOMMENDATION: {
        const { productId, discountRate } = action.payload;

        // 할인 적용
        const updatedProducts = ProductService.applyDiscountToProducts(
          state.products,
          [productId],
          discountRate
        );

        return {
          ...state,
          products: updatedProducts,
        };
      }

      default:
        return state;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';

    alert(errorMessage);
    return state;
  }
};
