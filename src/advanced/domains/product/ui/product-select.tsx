import React, { useState } from 'react';

import { useAppContext } from '../../../app/app-context';
import { ActionType } from '../../../app/app-reducer';
import * as ProductEntity from '../entities/product';

const ProductSelect = () => {
  const { state, dispatch } = useAppContext();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const handleAddToCartClick = () => {
    if (selectedProductId === null) return;

    dispatch({
      type: ActionType.ADD_TO_CART,
      payload: { productId: selectedProductId },
    });
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCartClick}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
