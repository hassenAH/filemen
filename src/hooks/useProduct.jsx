import { useProductContext } from './useProductContext';

export const useProduct = () => {
  const { selectedProduct, dispatch } = useProductContext();

  const selectVariant = (variantId) => {
    if (!selectedProduct || !selectedProduct.variants) {
      console.error('No product or variants available');
      return; // Early return to avoid errors
    }

    const selectedVariant = selectedProduct.variants.find(variant => variant.variantId === variantId);

    if (!selectedVariant) {
      console.error('Variant not found');
      return; // Early return if no variant is found
    }

    dispatch({ type: 'SELECT_VARIANT', payload: selectedVariant });

    if (selectedVariant.sizes.length === 1) {
      dispatch({
        type: 'SINGLE_SIZE',
        payload: {
          selectedSkuId: selectedVariant.sizes[0].skuId,
          quantity: selectedVariant.sizes[0].quantity,
        },
      });
    }
  };

  const selectSize = ({ skuId, value, stock }) => {
    if (!skuId || !value) {
      console.error('Invalid size selection');
      return; // Early return to prevent dispatching undefined values
    }
    dispatch({ type: 'SELECT_SIZE', payload: { skuId, value, stock } });
  };

  return { selectVariant, selectSize };
};
