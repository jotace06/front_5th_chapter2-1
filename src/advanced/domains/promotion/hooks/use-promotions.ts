import { useEffect } from 'react';

import { useAppState, useAppDispatch } from '../../../app/app-context';
import { ActionType } from '../../../app/app-reducer';
import * as PromotionPolicy from '../policies/promotion-policies';

/**
 * 프로모션 효과를 처리하는 커스텀 훅
 */
export const usePromotions = () => {
  const { products, lastSelected } = useAppState();
  const dispatch = useAppDispatch();

  // 번개세일 타이머 - 30초마다 랜덤 상품에 20% 할인 (30% 확률)
  useEffect(() => {
    const flashSaleTimer = setInterval(() => {
      // 랜덤 상품 선택 (서비스 레이어 활용)
      const randomProduct =
        PromotionPolicy.selectRandomProductForFlashSale(products);

      // 선택된 상품이 없으면 종료
      if (!randomProduct) return;

      // 번개세일 적용
      dispatch({
        type: ActionType.APPLY_FLASH_SALE,
        payload: {
          productId: randomProduct.id,
          discountRate: PromotionPolicy.FLASH_SALE_DISCOUNT_RATE,
        },
      });

      // 알림 표시
      alert(PromotionPolicy.createFlashSaleMessage(randomProduct));
    }, 30000); // 30초마다

    return () => clearInterval(flashSaleTimer);
  }, [products, dispatch]);

  // 추천 타이머 - 60초마다 마지막에 선택하지 않은 상품 중 하나를 추천
  useEffect(() => {
    const recommendationTimer = setInterval(() => {
      // 추천 상품 선택 (서비스 레이어 활용)
      const recommendedProduct = PromotionPolicy.selectProductForRecommendation(
        products,
        lastSelected
      );

      // 추천할 상품이 없으면 종료
      if (!recommendedProduct) return;

      // 추천 상품에 할인 적용
      dispatch({
        type: ActionType.APPLY_RECOMMENDATION,
        payload: {
          productId: recommendedProduct.id,
          discountRate: PromotionPolicy.RECOMMENDATION_DISCOUNT_RATE,
        },
      });

      // 알림 표시
      alert(PromotionPolicy.createRecommendationMessage(recommendedProduct));
    }, 60000); // 60초마다

    return () => clearInterval(recommendationTimer);
  }, [products, lastSelected, dispatch]);
};
