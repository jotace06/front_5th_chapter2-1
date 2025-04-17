import { Product } from '../../product/entities/product';

export interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

/**
 * 상품 객체로부터 장바구니 아이템 생성
 */
export const createCartItemFromProduct = (
  product: Product,
  quantity: CartItem['quantity'] = 1
): CartItem => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity,
  };
};

/**
 * 장바구니 아이템의 수량 반환
 */
export const getCartItemQuantity = (cartItem: CartItem): number => {
  return cartItem.quantity;
};

/**
 * 장바구니 아이템이 비어있는지 확인
 */
export const isEmptyCartItem = (cartItem: CartItem): boolean => {
  return cartItem.quantity <= 0;
};

/**
 * 장바구니 아이템의 총 가격 계산
 */
export const calculateCartItemTotal = (cartItem: CartItem): number => {
  return cartItem.price * cartItem.quantity;
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = (
  cartItem: CartItem,
  quantityChange: CartItem['quantity']
): CartItem => {
  return {
    ...cartItem,
    quantity: Math.max(0, cartItem.quantity + quantityChange),
  };
};
