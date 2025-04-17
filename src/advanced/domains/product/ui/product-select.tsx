import React, { useState, useEffect } from 'react';

import { useAppContext } from '../../../app/app-context';
import { ActionType } from '../../../app/app-reducer';
import * as ProductEntity from '../entities/product';

const ProductSelect = () => {
  const { state, dispatch } = useAppContext();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddToCartClick = () => {
    if (!selectedProductId) return;

    dispatch({
      type: ActionType.ADD_TO_CART,
      payload: { productId: selectedProductId },
    });
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  // 컴포넌트 마운트 시 재고가 있는 첫 번째 상품을 선택
  useEffect(() => {
    const firstSelectableProduct = state.products.find(ProductEntity.hasStock);

    if (firstSelectableProduct) {
      setSelectedProductId(firstSelectableProduct.id);
    }
  }, [state.products]);

  return (
    <>
      <select
        id="product-select"
        data-testid="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProductId}
        onChange={handleProductChange}
      >
        {state.products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={!ProductEntity.hasStock(product)}
          >
            {product.name} - {product.price}원
          </option>
        ))}
      </select>

      <button
        id="add-to-cart"
        data-testid="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCartClick}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
