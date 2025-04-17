export interface CartTotalProps {
  subtotal: number;
  finalTotal: number;
  discountRate: number;
  bonusPoints: number;
}

/**
 * 장바구니 합계 컴포넌트
 * 총액, 할인율, 포인트를 표시합니다.
 */
export const CartTotal = ({
  finalTotal,
  discountRate,
  bonusPoints,
}: CartTotalProps): string => {
  // 할인율 표시 요소
  const discountElement =
    discountRate > 0
      ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(
          1
        )}% 할인 적용)</span>`
      : '';

  // 포인트 표시 요소
  const pointsElement = `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoints})</span>`;

  return /*html*/ `
      <div class="text-xl font-bold my-4">총액: ${finalTotal}원${discountElement}${pointsElement}</div>
    `;
};
