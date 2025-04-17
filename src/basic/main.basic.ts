import { Options, updateUI } from './app/ui/render';
import { AppState, createInitialState } from './core/state/app-state';
import * as CartCommand from './app/commands/cart-commands';
import * as PromotionCommand from './app/commands/promotion-commands';

// 전역 상태 관리
let appState: AppState = createInitialState();
let $root: HTMLElement | null = null;

// 상태 변경 후 UI 업데이트 함수
const updateState = (newState: AppState, options?: Options): void => {
  appState = newState;
  updateUI($root, appState, eventHandlers, options);
};

// 이벤트 핸들러
const eventHandlers = {
  onAddToCart: (productId: string) => {
    updateState(CartCommand.addToCart(appState, productId));
  },

  onUpdateQuantity: (productId: string, change: number) => {
    if (change > 0) {
      updateState(CartCommand.increaseCartItemQuantity(appState, productId), {
        partialUpdate: true,
        targetId: productId,
      });
    } else if (change < 0) {
      updateState(CartCommand.decreaseCartItemQuantity(appState, productId));
    }
  },

  onRemoveItem: (productId: string) => {
    updateState(CartCommand.removeFromCart(appState, productId));
  },
};

if (!$root) {
  $root = document.getElementById('app') as HTMLElement;
}

appState = createInitialState();
updateUI($root, appState, eventHandlers);

// 프로모션 타이머 시작
const startPromoTimers = (): void => {
  // 번개세일 타이머
  setTimeout(() => {
    setInterval(() => {
      const probability = 0.3; // 30% 확률
      if (Math.random() < probability) {
        const [newState, message] = PromotionCommand.applyFlashSale(appState);
        if (message) {
          alert(message);
          updateState(newState);
        }
      }
    }, 30000); // 30초마다
  }, Math.random() * 10000); // 0~10초 사이에 시작

  // 추천 상품 타이머
  setTimeout(() => {
    setInterval(() => {
      if (appState.lastSelected) {
        const [newState, message] =
          PromotionCommand.applyRecommendation(appState);
        if (message) {
          alert(message);
          updateState(newState);
        }
      }
    }, 60000); // 60초마다
  }, Math.random() * 20000); // 0~20초 사이에 시작
};

// 프로모션 타이머 시작
startPromoTimers();
