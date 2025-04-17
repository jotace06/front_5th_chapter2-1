import { type Product } from '../../domains/product/entities/product';
import { type CartItem } from '../../domains/cart/entities/cart-item';

export interface AppState {
  products: Product[];
  cartItems: CartItem[];
  lastSelected: string | null;
  bonusPoints: number;
}

// 초기 상태 생성
export const createInitialState = (): AppState => {
  return {
    products: [
      { id: 'p1', name: '상품1', price: 10000, stock: 50 },
      { id: 'p2', name: '상품2', price: 20000, stock: 30 },
      { id: 'p3', name: '상품3', price: 30000, stock: 20 },
      { id: 'p4', name: '상품4', price: 15000, stock: 0 },
      { id: 'p5', name: '상품5', price: 25000, stock: 10 },
    ],
    cartItems: [],
    lastSelected: null,
    bonusPoints: 0,
  };
};
