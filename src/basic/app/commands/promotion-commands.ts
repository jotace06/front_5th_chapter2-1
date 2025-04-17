// 1_commands/promotion-commands.ts
import { type AppState } from '../../core/state';
import * as PromotionPolicy from '../../domains/promotion/policies';

/**
 * 번개세일 적용
 */
export const applyFlashSale = (state: AppState): [AppState, string | null] => {
  const randomProduct = PromotionPolicy.selectRandomFlashSaleProduct(
    state.products
  );
  if (!randomProduct) return [state, null];

  const productName = randomProduct.name;
  const productId = randomProduct.id;

  const updatedProducts = PromotionPolicy.applyFlashSaleDiscount(
    state.products,
    productId
  );

  return [
    { ...state, products: updatedProducts },
    PromotionPolicy.createFlashSaleMessage(productName),
  ];
};

/**
 * 추천 상품 할인 적용
 */
export const applyRecommendation = (
  state: AppState
): [AppState, string | null] => {
  if (!state.lastSelected) return [state, null];

  const recommendedProduct = PromotionPolicy.selectRecommendedProduct(
    state.products,
    state.lastSelected
  );

  if (!recommendedProduct) return [state, null];

  const productName = recommendedProduct.name;
  const productId = recommendedProduct.id;

  const updatedProducts = PromotionPolicy.applyRecommendationDiscount(
    state.products,
    productId
  );

  return [
    { ...state, products: updatedProducts },
    PromotionPolicy.createRecommendationMessage(productName),
  ];
};
