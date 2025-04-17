import { type CartItem as CartItemType } from '../../entities/cart-item';

export interface CartItemProps {
  cartItem: CartItemType;
}

/**
 * 장바구니 아이템 컴포넌트
 * 제품 정보와 수량 변경 버튼을 표시합니다.
 */
export const CartItem = ({ cartItem }: CartItemProps): string => {
  return /*html*/ `
    <div id="${cartItem.id}" class="flex justify-between items-center mb-2"><span class="cart-item-info" data-product-id="${cartItem.id}">${cartItem.name} - ${cartItem.price}원 x ${cartItem.quantity}</span><div class="cart-item-actions"><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="-1">-</button><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${cartItem.id}" data-change="1">+</button><button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${cartItem.id}">삭제</button></div></div>
  `;
};
