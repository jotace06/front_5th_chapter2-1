import { type CartItem } from '../entities/cart-item';
import * as CartService from '../services/cart-services';
import * as CartItemEntity from '../entities/cart-item';

// 상품별 할인율 정의 (10개 이상 구매 시 적용)
const PRODUCT_DISCOUNT_RATE_MAP: Record<string, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 대량 구매 할인 기준 수량
const BULK_PURCHASE_THRESHOLD = 30;

// 대량 구매 할인율
const BULK_PURCHASE_DISCOUNT_RATE = 0.25;

// 화요일 할인율
const TUESDAY_DISCOUNT_RATE = 0.1;

// 포인트 적립 기준액
const POINTS_PER_AMOUNT = 1000;

/**
 * 단일 상품의 개별 할인율 계산
 */
export const calculateItemDiscount = (item: CartItem): number => {
  const quantity = CartItemEntity.getCartItemQuantity(item);
  if (quantity < 10) return 0;

  return PRODUCT_DISCOUNT_RATE_MAP[item.id] || 0;
};

/**
 * 장바구니 아이템별 할인이 적용된 합계 계산
 */
export const calculateItemDiscountedTotal = (
  cart: CartItem[]
): {
  subtotal: number;
  discountedTotal: number;
  totalItems: number;
} => {
  const subtotal = CartService.calculateCartSubtotal(cart);
  const totalItems = CartService.getTotalQuantity(cart);

  let discountedTotal = 0;
  cart.forEach((item) => {
    const itemTotal = CartItemEntity.calculateCartItemTotal(item);
    const discount = calculateItemDiscount(item);
    discountedTotal += itemTotal * (1 - discount);
  });

  return { subtotal, discountedTotal, totalItems };
};

/**
 * 대량 구매 할인 적용 여부 확인
 */
export const isBulkPurchaseDiscountApplicable = (
  totalItems: number
): boolean => {
  return totalItems >= BULK_PURCHASE_THRESHOLD;
};

/**
 * 대량 구매 할인 적용 금액 계산
 */
export const calculateBulkDiscountedTotal = (subtotal: number): number => {
  return subtotal * (1 - BULK_PURCHASE_DISCOUNT_RATE);
};

/**
 * 화요일 할인 적용 여부 확인
 */
export const isTuesdayDiscountApplicable = (date: Date): boolean => {
  return date.getDay() === 2; // 화요일 (2, 목요일은 4)
};

/**
 * 화요일 할인 적용 금액 계산
 */
export const applyTuesdayDiscount = (amount: number): number => {
  return amount * (1 - TUESDAY_DISCOUNT_RATE);
};

/**
 * 최종 할인율 계산
 */
export const calculateFinalDiscountRate = (
  subtotal: number,
  finalTotal: number
): number => {
  return subtotal > 0 ? 1 - finalTotal / subtotal : 0;
};

/**
 * 포인트 적립액 계산
 */
export const calculateBonusPoints = (finalTotal: number): number => {
  return Math.floor(finalTotal / POINTS_PER_AMOUNT);
};

/**
 * 장바구니 최종 합계 계산 (모든 할인 포함)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  currentDate: Date = new Date()
): {
  subtotal: number;
  finalTotal: number;
  discountRate: number;
  bonusPoints: number;
} => {
  // CartEntity 함수를 사용하여 빈 장바구니 확인
  if (CartService.isCartEmpty(cart)) {
    return {
      subtotal: 0,
      finalTotal: 0,
      discountRate: 0,
      bonusPoints: 0,
    };
  }

  // 아이템별 할인 계산 - 엔티티 함수들을 활용한 함수 호출
  const { subtotal, discountedTotal, totalItems } =
    calculateItemDiscountedTotal(cart);

  // 대량 구매 할인 고려
  let finalTotal = discountedTotal;
  // 일반 아이템 할인율 계산
  let discountRate = (subtotal - discountedTotal) / subtotal;

  if (isBulkPurchaseDiscountApplicable(totalItems)) {
    // original 로직: 이미 할인된 금액에 대량 구매 할인 적용
    const bulkDiscount = discountedTotal * BULK_PURCHASE_DISCOUNT_RATE;
    // 개별 할인액
    const itemDiscount = subtotal - discountedTotal;

    // 대량 구매 할인액이 개별 할인액보다 크면 대량 구매 할인 적용
    if (bulkDiscount > itemDiscount) {
      finalTotal = subtotal * (1 - BULK_PURCHASE_DISCOUNT_RATE);
      discountRate = BULK_PURCHASE_DISCOUNT_RATE;
    }
    // 그렇지 않으면 개별 할인 유지
  }

  // 화요일 할인 적용 - 원래 코드와 같이 max 함수를 사용하여 더 큰 할인율 적용
  if (isTuesdayDiscountApplicable(currentDate)) {
    // 기존 할인율과 화요일 할인율 중 더 큰 값 사용
    if (TUESDAY_DISCOUNT_RATE > discountRate) {
      // 화요일 할인이 더 크면 화요일 할인 적용
      finalTotal = subtotal * (1 - TUESDAY_DISCOUNT_RATE);
      discountRate = TUESDAY_DISCOUNT_RATE;
    }
    // 기존의 아이템별 또는 대량구매 할인이 더 크면 변경 없음
  }

  // 포인트 계산
  const bonusPoints = calculateBonusPoints(finalTotal);

  return {
    subtotal,
    finalTotal: Math.round(finalTotal),
    discountRate,
    bonusPoints,
  };
};
