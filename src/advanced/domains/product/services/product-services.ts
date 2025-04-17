import { type Product } from '../entities/product';
import * as ProductEntity from '../entities/product';

const LOW_STOCK_THRESHOLD = 5;

/**
 * 제품 ID로 검색
 */
export const findProductById = (
  products: Product[],
  productId: Product['id']
): Product | undefined => {
  return products.find(
    (product) => ProductEntity.getProductId(product) === productId
  );
};

/**
 * 제품의 재고 충분 여부 확인
 */
export const hasEnoughStock = (
  products: Product[],
  productId: Product['id'],
  requiredQuantity: Product['stock'] = 1
): boolean => {
  const product = findProductById(products, productId);

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  // 재고가 필요한 수량보다 적으면 false 반환
  if (ProductEntity.getProductStock(product) < requiredQuantity) {
    return false;
  }

  return true;
};

/**
 * 컬렉션 내 특정 제품의 재고 업데이트
 */
export const updateProductsStock = (
  products: Product[],
  productId: Product['id'],
  stockChange: Product['stock']
): Product[] => {
  if (stockChange === 0) return products;

  const product = findProductById(products, productId);

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  if (
    stockChange < 0 &&
    !ProductEntity.hasStockForQuantity(product, Math.abs(stockChange))
  ) {
    throw new Error('재고가 부족합니다.');
  }

  return products.map((product) =>
    ProductEntity.getProductId(product) === productId
      ? ProductEntity.updateProductStock(product, stockChange)
      : product
  );
};

/**
 * 재고 부족 제품 필터링
 */
export const getLowStockProducts = (
  products: Product[],
  threshold: number = LOW_STOCK_THRESHOLD
): Product[] => {
  return products.filter(
    (product) => ProductEntity.getProductStock(product) < threshold
  );
};

/**
 * 특정 제품들에 할인 적용
 */
export const applyDiscountToProducts = (
  products: Product[],
  productIds: Array<Product['id']>,
  discountRate: number
): Product[] => {
  return products.map((product) => {
    if (productIds.includes(ProductEntity.getProductId(product))) {
      const currentPrice = ProductEntity.getProductPrice(product);
      const discountedPrice = Math.round(currentPrice * (1 - discountRate));
      return ProductEntity.updateProductPrice(product, discountedPrice);
    }
    return product;
  });
};
