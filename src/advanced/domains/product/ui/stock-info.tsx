import React from 'react';

import { useAppState } from '../../../app/app-context';
import * as CartPolicy from '../../cart/policies/cart-policies';

const StockInfo = () => {
  const { products } = useAppState();

  const lowStockInfo = CartPolicy.getLowStockInfo(products);

  return (
    <div
      id="stock-status"
      data-testid="stock-status"
      className="text-sm text-gray-500 mt-2 whitespace-pre-line"
    >
      {lowStockInfo}
    </div>
  );
};

export default StockInfo;
