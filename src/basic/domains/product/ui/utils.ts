export const getSelectedProductId = (container: HTMLElement): string | null => {
  const selectElement = container.querySelector(
    '#product-select'
  ) as HTMLSelectElement;
  return selectElement?.value || null;
};
