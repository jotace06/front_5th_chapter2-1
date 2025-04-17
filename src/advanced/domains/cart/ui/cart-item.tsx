import React from 'react';

import { CartItem as CartItemType } from '../entities/cart-item';
import { useAppDispatch } from '../../../app/app-context';
import { ActionType } from '../../../app/app-reducer';

interface CartItemProps {
  cartItem: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ cartItem }) => {
  const dispatch = useAppDispatch();

  const handleIncreaseClick = () => {
    dispatch({
      type: ActionType.INCREASE_QUANTITY,
      payload: { productId: cartItem.id },
    });
  };

  const handleDecreaseClick = () => {
    dispatch({
      type: ActionType.DECREASE_QUANTITY,
      payload: { productId: cartItem.id },
    });
  };

  const handleRemoveClick = () => {
    dispatch({
      type: ActionType.REMOVE_FROM_CART,
      payload: { productId: cartItem.id },
    });
  };

  return (
    <div id={cartItem.id} className="flex justify-between items-center mb-2">
      <span>
        {cartItem.name} - {cartItem.price}원 x {cartItem.quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={cartItem.id}
          data-change="-1"
          onClick={handleDecreaseClick}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={cartItem.id}
          data-change="1"
          onClick={handleIncreaseClick}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={cartItem.id}
          onClick={handleRemoveClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

CartItem.displayName = 'CartItem';

export default CartItem;
