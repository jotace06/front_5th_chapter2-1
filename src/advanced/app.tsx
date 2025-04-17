import React from 'react';
import ProductSelect from './domains/product/ui/product-select';
import StockInfo from './domains/product/ui/stock-info';
import CartList from './domains/cart/ui/cart-list';
import CartTotal from './domains/cart/ui/cart-total';
import { usePromotions } from './domains/promotion/hooks/use-promotions';

function App() {
  usePromotions();

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">React 장바구니</h1>
        <CartList />
        <CartTotal />
        <ProductSelect />
        <StockInfo />
      </div>
    </div>
  );
}

export default App;
