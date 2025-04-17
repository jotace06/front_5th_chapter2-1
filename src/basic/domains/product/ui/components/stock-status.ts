import { type Product } from '../../entities';
import * as ProductPolicy from '../../policies';

interface StockStatusProps {
  products: Product[];
}

/**
 * 재고 상태 표시 컴포넌트
 * 기존 동작을 그대로 유지하며 template literal 반환
 */
export const StockStatus = (props: StockStatusProps): string => {
  const { products } = props;

  return ProductPolicy.getLowStockInfo(products);
};
