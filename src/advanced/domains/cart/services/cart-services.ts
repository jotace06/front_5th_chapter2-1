import { type CartItem } from '../entities/cart-item';
import { type Product } from '../../product/entities/product';
import * as ProductEntity from '../../product/entities/product';
import * as ProductService from '../../product/services/product-services';
import * as CartItemEntity from '../entities/cart-item';

/**
 * 장바구니에서 상품 확인
 */
export const findCartItem = (
  cartItems: CartItem[],
  productId: string
): CartItem | undefined => {
  return cartItems.find((item) => item.id === productId);
};

/**
 * 장바구니 내 특정 상품의 인덱스 찾기
 */
const findCartItemIndex = (
  cartItems: CartItem[],
  productId: CartItem['id']
): number => {
  return cartItems.findIndex((item) => item.id === productId);
};

/**
 * 장바구니 총 상품 수량
 */
export const getTotalQuantity = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
};

/**
 * 장바구니 소계 계산
 */
export const calculateCartSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (sum, cartItem) => sum + CartItemEntity.calculateCartItemTotal(cartItem),
    0
  );
};

/**
 * 장바구니가 비어있는지 확인
 */
export const isCartEmpty = (cartItems: CartItem[]): boolean => {
  return cartItems.length === 0;
};

/**
 * 장바구니에 추가 (단순한 구현)
 */
const addItemToCart = (
  cartItems: CartItem[],
  newCartItem: CartItem
): CartItem[] => {
  const targetIndex = findCartItemIndex(cartItems, newCartItem.id);

  if (targetIndex >= 0) {
    // 기존 아이템이 있으면 수량만 증가
    return cartItems.map((cartItem, index) =>
      index === targetIndex
        ? CartItemEntity.updateCartItemQuantity(cartItem, newCartItem.quantity)
        : cartItem
    );
  }

  // 새로 추가
  return [...cartItems, newCartItem];
};

/**
 * 장바구니에 상품 추가 (에러처리 + addItemToCart 사용)
 */
export const addToCart = (
  products: Product[],
  cart: CartItem[],
  productId: string
): CartItem[] => {
  // 상품 찾기
  const product = ProductService.findProductById(products, productId);

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다');
  }

  // 재고 확인
  if (!ProductEntity.hasStock(product)) {
    throw new Error('재고가 부족합니다.');
  }

  // 장바구니 아이템 생성
  const newItem = CartItemEntity.createCartItemFromProduct(product, 1);

  // 장바구니에 추가
  return addItemToCart(cart, newItem);
};

/**
 * 장바구니에서 아이템 제거 (단순한 구현)
 */
const removeItemFromCart = (
  cartItems: CartItem[],
  productId: CartItem['id']
): CartItem[] => {
  return cartItems.filter((cartItem) => cartItem.id !== productId);
};

/**
 * 장바구니에서 상품 제거 (에러처리 + removeItemFromCart 사용)
 */
export const removeFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  const cartItem = findCartItem(cart, productId);

  if (!cartItem) {
    throw new Error('장바구니에 해당 상품이 없습니다.');
  }

  return removeItemFromCart(cart, productId);
};

/**
 * 장바구니 아이템 수량 변경 (단순한 구현)
 */
const updateItemQuantity = (
  cart: CartItem[],
  productId: CartItem['id'],
  change: number
): CartItem[] => {
  const targetIndex = findCartItemIndex(cart, productId);

  if (targetIndex < 0) {
    return cart;
  }

  const updatedItem = CartItemEntity.updateCartItemQuantity(
    cart[targetIndex],
    change
  );

  // 수량이 0이하면 아이템 제거
  if (CartItemEntity.isEmptyCartItem(updatedItem)) {
    return removeItemFromCart(cart, productId);
  }

  // 그렇지 않으면 업데이트
  return cart.map((item, index) =>
    index === targetIndex ? updatedItem : item
  );
};

/**
 * 장바구니 상품 수량 변경 (에러처리 + updateItemQuantity 사용)
 */
export const changeCartItemQuantity = (
  cart: CartItem[],
  products: Product[],
  productId: string,
  change: number
): CartItem[] => {
  if (change === 0) return cart;

  const cartItem = findCartItem(cart, productId);

  if (!cartItem) {
    throw new Error('장바구니에 해당 상품이 없습니다.');
  }

  // 수량을 증가시키는 경우 재고 확인
  if (change > 0) {
    const product = ProductService.findProductById(products, productId);

    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    if (!ProductEntity.hasStockForQuantity(product, change)) {
      throw new Error('재고가 부족합니다.');
    }
  }

  // 수량을 감소시키는 경우 장바구니에 담긴 상품 수량 확인
  if (change < 0) {
    if (cartItem.quantity < Math.abs(change)) {
      throw new Error('장바구니에 담긴 상품 수량이 부족합니다.');
    }
  }

  // 장바구니 아이템 수량 업데이트
  return updateItemQuantity(cart, productId, change);
};
