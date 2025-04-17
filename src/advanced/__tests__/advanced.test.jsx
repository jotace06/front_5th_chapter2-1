import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../app';
import { AppProvider } from '../app/app-context';
import { createInitialState } from '../app/app-state';

// 테스트를 위한 앱 렌더링 헬퍼 함수
const renderApp = (initialState = createInitialState()) => {
  return render(
    <AppProvider initialState={initialState}>
      <App />
    </AppProvider>
  );
};

describe('advanced test', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.useFakeTimers();
    const thursday = new Date('2025-04-17'); // 목요일
    vi.setSystemTime(thursday);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    renderApp();

    // 상품 선택 드롭다운 찾기
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // 옵션 확인
    const options = within(select).getAllByRole('option');
    expect(options.length).toBe(5);

    // 첫 번째 상품 확인
    expect(options[0].value).toBe('p1');
    expect(options[0].textContent).toContain('상품1');
    expect(options[0].textContent).toContain('10000');
    expect(options[0].disabled).toBe(false);

    // 마지막 상품 확인
    expect(options[4].value).toBe('p5');
    expect(options[4].textContent).toContain('상품5');
    expect(options[4].textContent).toContain('25000');
    expect(options[4].disabled).toBe(false);

    // 재고 없는 상품 확인 (상품4)
    expect(options[3].value).toBe('p4');
    expect(options[3].textContent).toContain('상품4');
    expect(options[3].textContent).toContain('15000');
    expect(options[3].disabled).toBe(true);
  });

  it('초기 상태: 주요 UI 요소가 올바르게 렌더링되었는지 확인', () => {
    renderApp();

    // 제목
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'React 장바구니'
    );

    // 상품 선택 드롭다운
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // 추가 버튼
    expect(screen.getByRole('button', { name: /추가/i })).toBeInTheDocument();

    // 장바구니 항목 영역 (id 사용)
    expect(screen.getByTestId('cart-items')).toBeInTheDocument();

    // 총액 정보
    const cartTotal = screen.getByTestId('cart-total');
    expect(cartTotal).toBeInTheDocument();
    expect(cartTotal).toHaveTextContent(/총액: 0원/i);

    // 포인트 정보
    expect(screen.getByTestId('loyalty-points')).toHaveTextContent(
      /포인트: 0/i
    );
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', async () => {
    renderApp();

    // 상품 선택 및 추가
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 장바구니에 상품이 추가되었는지 확인
    const cartItems = screen.getByTestId('cart-items');
    expect(within(cartItems).getByText(/상품1/i)).toBeInTheDocument();
    expect(within(cartItems).getByText(/x 1/i)).toBeInTheDocument();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', async () => {
    renderApp();

    // 상품 추가
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 수량 증가 버튼 클릭
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    // 수량이 증가했는지 확인
    expect(screen.getByText(/x 2/i)).toBeInTheDocument();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', async () => {
    renderApp();

    // 상품 추가
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 삭제 버튼 클릭
    const removeButton = screen.getByText('삭제');
    fireEvent.click(removeButton);

    // 장바구니가 비어있는지 확인 (자식 요소가 없는지 확인)
    const cartItems = screen.getByTestId('cart-items');
    expect(cartItems.children.length).toBe(0);

    // 총액이 0원인지 확인
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/총액: 0원/i);
  });

  it('총액이 올바르게 계산되는지 확인', async () => {
    renderApp();

    // 상품 추가 두 번
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // 총액이 올바른지 확인
    expect(screen.getByTestId('cart-total')).toHaveTextContent(
      /총액: 20000원/i
    );

    // 포인트가 올바른지 확인
    expect(screen.getByTestId('loyalty-points')).toHaveTextContent(
      /포인트: 20/i
    );
  });

  it('할인이 올바르게 적용되는지 확인', async () => {
    renderApp();

    // 상품 추가 10번 (10개 이상 구매 시 할인 적용)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    for (let i = 0; i < 10; i++) {
      fireEvent.click(addButton);
    }

    // 할인이 적용되었는지 확인
    expect(screen.getByTestId('cart-total')).toHaveTextContent(
      /10.0% 할인 적용/i
    );
  });

  it('포인트가 올바르게 계산되는지 확인', async () => {
    renderApp();

    // 상품2 추가
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p2' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 포인트 확인 (20000원 * 1개 = 20000원, 1000원당 1포인트 = 20포인트)
    expect(screen.getByTestId('loyalty-points')).toHaveTextContent(
      /포인트: 20/i
    );
  });

  it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', async () => {
    renderApp();

    // 상품5 추가 (재고 10개)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p5' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 장바구니에 상품5가 추가되었는지 확인
    expect(screen.getByText(/상품5.*x 1/i)).toBeInTheDocument();

    // 수량 증가 버튼 찾기 (첫 번째 +)
    const increaseButtons = screen.getAllByText('+');
    const increaseP5 = increaseButtons[0];

    // 재고 한계까지 수량 증가
    for (let i = 0; i < 9; i++) {
      fireEvent.click(increaseP5);
    }

    // 수량이 10개인지 확인
    expect(screen.getByText(/상품5.*x 10/i)).toBeInTheDocument();

    // 재고 한계 초과 시도
    fireEvent.click(increaseP5);

    // 알림이 표시되었는지 확인
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('재고가 부족합니다')
    );

    // 수량이 여전히 10개인지 확인
    expect(screen.getByText(/상품5.*x 10/i)).toBeInTheDocument();

    // 재고 부족 정보가 표시되는지 확인
    const stockInfo = screen.getByTestId('stock-status');
    expect(stockInfo).toHaveTextContent(/상품5: 품절/i);
  });

  it('화요일 할인이 적용되는지 확인', async () => {
    // 화요일로 날짜 설정
    vi.useFakeTimers();
    const tuesday = new Date('2024-10-15'); // 화요일
    vi.setSystemTime(tuesday);

    renderApp();

    // 상품 추가
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });

    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 화요일 할인이 적용되었는지 확인
    expect(screen.getByTestId('cart-total')).toHaveTextContent(
      /10.0% 할인 적용/i
    );

    vi.useRealTimers();
  });
});
