import React from 'react';

import { useAppState } from '../../../app/app-context';
import * as CartPolicy from '../policies/cart-policies';

const CartTotal = () => {
  const { cartItems } = useAppState();

  const { finalTotal, discountRate, bonusPoints } =
    CartPolicy.calculateCartTotal(cartItems);

  return (
    <div
      id="cart-total"
      data-testid="cart-total"
      className="text-xl font-bold my-4"
    >
      총액: {finalTotal}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span
        id="loyalty-points"
        data-testid="loyalty-points"
        className="text-blue-500 ml-2"
      >
        (포인트: {bonusPoints})
      </span>
    </div>
  );
};

export default CartTotal;
