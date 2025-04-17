import { Product } from '../../entities';

interface ProductSelectProps {
  products: Product[];
  selectedId: string | null;
}

export const ProductOptions = ({
  products,
  selectedId,
}: ProductSelectProps): string => {
  return products
    .map(
      (product) =>
        `<option 
          value="${product.id}" 
          ${product.stock === 0 ? 'disabled' : ''} 
          ${product.id === selectedId ? 'selected' : ''}
        >${product.name} - ${product.price}원</option>`
    )
    .join('');
};
