import { Product } from '../../product/entities';
import * as ProductEntity from '../../product/entities';
import * as ProductService from '../../product/services';

// 번개세일 할인율
const FLASH_SALE_DISCOUNT_RATE = 0.2; // 20%

/**
 * 랜덤으로 번개세일 적용 가능 상품 선택
 */
export const selectRandomFlashSaleProduct = (
  products: Product[]
): Product | undefined => {
  // 재고가 있는 상품만 필터링
  const availableProducts = products.filter((product) =>
    ProductEntity.hasStock(product)
  );

  if (availableProducts.length === 0) return;

  // 랜덤으로 상품 선택
  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
};

/**
 * 번개세일 할인 적용
 */
export const applyFlashSaleDiscount = (
  products: Product[],
  targetProductId: string
): Product[] => {
  return ProductService.applyDiscountToProducts(
    products,
    [targetProductId],
    FLASH_SALE_DISCOUNT_RATE
  );
};

/**
 * 추천 상품 선택 (마지막 선택 상품과 다른 상품)
 */
export const selectRecommendedProduct = (
  products: Product[],
  lastSelectedProductId: string
): Product | undefined => {
  // 마지막 선택 상품이 아니면서 재고가 있는 상품만 필터링
  const recommendableProducts = products.filter(
    (product) =>
      ProductEntity.getProductId(product) !== lastSelectedProductId &&
      ProductEntity.hasStock(product)
  );

  if (recommendableProducts.length === 0) return undefined;

  // 랜덤으로 상품 선택
  const randomIndex = Math.floor(Math.random() * recommendableProducts.length);
  return recommendableProducts[randomIndex];
};

/**
 * 추천 상품 할인 적용
 */
export const applyRecommendationDiscount = (
  products: Product[],
  targetProductId: string
): Product[] => {
  const RECOMMENDATION_DISCOUNT_RATE = 0.05; // 5% 할인

  return products.map((product) => {
    if (ProductEntity.getProductId(product) === targetProductId) {
      const currentPrice = ProductEntity.getProductPrice(product);
      const discountedPrice = Math.round(
        currentPrice * (1 - RECOMMENDATION_DISCOUNT_RATE)
      );
      return ProductEntity.updateProductPrice(product, discountedPrice);
    }
    return product;
  });
};

/**
 * 프로모션 메시지 생성
 */
export const createFlashSaleMessage = (productName: string): string => {
  return `번개세일! ${productName}이(가) ${
    FLASH_SALE_DISCOUNT_RATE * 100
  }% 할인 중입니다!`;
};

export const createRecommendationMessage = (productName: string): string => {
  return `${productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`;
};
