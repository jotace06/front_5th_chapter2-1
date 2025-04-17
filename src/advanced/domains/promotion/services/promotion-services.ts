import { type Product } from '../../product/entities/product';
import * as ProductEntity from '../../product/entities/product';

// 플래시 세일 확률 (30%)
const FLASH_SALE_PROBABILITY = 0.3;

// 플래시 세일 할인율 (20%)
export const FLASH_SALE_DISCOUNT_RATE = 0.2;

// 추천 상품 할인율 (5%)
export const RECOMMENDATION_DISCOUNT_RATE = 0.05;

/**
 * 플래시 세일을 적용할 랜덤 상품 선택
 */
export const selectRandomProductForFlashSale = (
  products: Product[]
): Product | null => {
  // 확률 체크 (30%)
  if (Math.random() > FLASH_SALE_PROBABILITY) return null;

  // 재고 있는 상품만 필터링
  const availableProducts = products.filter(ProductEntity.hasStock);

  // 재고 있는 상품이 없으면 null 반환
  if (availableProducts.length === 0) return null;

  // 랜덤 상품 선택
  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
};

/**
 * 추천할 상품 선택 (마지막 선택한 상품 제외)
 */
export const selectProductForRecommendation = (
  products: Product[],
  lastSelectedId: string | null
): Product | null => {
  // 재고 있고 마지막 선택한 상품이 아닌 것만 필터링
  const availableProducts = products.filter(
    (product) =>
      ProductEntity.hasStock(product) && product.id !== lastSelectedId
  );

  // 추천할 상품이 없으면 null 반환
  if (availableProducts.length === 0) return null;

  // 랜덤 상품 선택
  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
};

/**
 * 플래시 세일 메시지 생성
 */
export const createFlashSaleMessage = (product: Product): string => {
  return `번개세일! "${product.name}" 상품이 ${FLASH_SALE_DISCOUNT_RATE * 100}% 할인됩니다!`;
};

/**
 * 추천 상품 메시지 생성
 */
export const createRecommendationMessage = (product: Product): string => {
  return `추천 상품! "${product.name}"을 장바구니에 추가해보세요. (${RECOMMENDATION_DISCOUNT_RATE * 100}% 할인)`;
};
