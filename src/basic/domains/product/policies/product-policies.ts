import { Product } from "../entities";
import { getLowStockProducts } from "../services";
import * as ProductEntity from "../entities";

export const getLowStockInfo = (products: Product[]): string => {
  // 서비스 레이어 함수를 통해 재고 부족 상품 필터링
  const lowStockProducts = getLowStockProducts(products);

  // 정책 레이어에서 표현 형식(메시지 포맷) 결정
  return lowStockProducts
    .map((product) => {
      const name = ProductEntity.getProductName(product);
      const stock = ProductEntity.getProductStock(product);
      return `${name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : "품절"}`;
    })
    .join("\n");
};
