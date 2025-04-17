import React from 'react';

import { CartItem as CartItemType } from '../entities/cart-item';
import { useAppContext } from '../../../app/app-context';
import { ActionType } from '../../../app/app-reducer';

interface CartItemProps {
  cartItem: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ cartItem: item }) => {
  const { dispatch } = useAppContext();

  const handleIncreaseClick = () => {
    dispatch({
      type: ActionType.INCREASE_QUANTITY,
      payload: { productId: item.id },
    });
  };

  const handleDecreaseClick = () => {
    dispatch({
      type: ActionType.DECREASE_QUANTITY,
      payload: { productId: item.id },
    });
  };

  const handleRemoveClick = () => {
    dispatch({
      type: ActionType.REMOVE_FROM_CART,
      payload: { productId: item.id },
    });
  };

  return (
    <div id={item.id} className="flex justify-between items-center mb-2">
      <span>
        {item.name} - {item.price}원 x {item.quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={item.id}
          data-change="-1"
          onClick={handleDecreaseClick}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={item.id}
          data-change="1"
          onClick={handleIncreaseClick}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={item.id}
          onClick={handleRemoveClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
