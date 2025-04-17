// 기본 제품 정보
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
}

/**
 * 제품의 재고 여부 확인
 */
export const hasStock = (product: Product): boolean => {
  return product.stock > 0;
};

/**
 * 지정된 수량만큼 재고가 있는지 확인
 */
export const hasStockForQuantity = (
  product: Product,
  quantity: number
): boolean => {
  return product.stock >= quantity;
};

/**
 * 제품 ID 반환
 */
export const getProductId = (product: Product): Product['id'] => {
  return product.id;
};

/**
 * 제품명 반환
 */
export const getProductName = (product: Product): Product['name'] => {
  return product.name;
};

/**
 * 제품 재고 수량 반환
 */
export const getProductStock = (product: Product): Product['stock'] => {
  return product.stock;
};

/**
 * 제품 가격 반환
 */
export const getProductPrice = (product: Product): Product['price'] => {
  return product.price;
};

/**
 * 제품 가격 업데이트
 */
export const updateProductPrice = (
  product: Product,
  newPrice: Product['price']
): Product => {
  return { ...product, price: newPrice };
};

/**
 * 제품 재고 수량 업데이트
 */
export const updateProductStock = (
  product: Product,
  change: Product['stock']
): Product => {
  return { ...product, stock: Math.max(0, product.stock + change) };
};
