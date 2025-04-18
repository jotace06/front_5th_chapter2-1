import { type Product } from '../../product/entities/product';
import * as ProductService from '../../product/services/product-services';
import * as ProductEntity from '../../product/entities/product';

/**
 * 재고 부족 상품 정보 문자열 생성
 */
export const getLowStockInfo = (products: Product[]): string => {
  // 서비스 레이어 함수를 통해 재고 부족 상품 필터링
  const lowStockProducts = ProductService.getLowStockProducts(products);

  // 정책 레이어에서 표현 형식(메시지 포맷) 결정
  return lowStockProducts
    .map((product) => {
      const name = ProductEntity.getProductName(product);
      const stock = ProductEntity.getProductStock(product);
      return `${name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : '품절'}`;
    })
    .join(' ');
};
