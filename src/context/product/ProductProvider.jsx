
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductContext from 'context/product/product-context';
import API from '../../API/axiosConfig';


export const useProductContext = () => useContext(ProductContext);

const initialState = {
  productIsReady: false,
  selectedProduct: null,
  selectedVariant: null,
  selectedSkuId: '',
  selectedSize: '',
  singleSize: null,
};

const productReducer = (state, action) => {
  // reducer body remains the same
};

const ProductProvider = ({ children }) => {
  const { id: slugId } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getProduct = async () => {
    try {
      const { data } = await API.get(`/products/${slugId}`);
      if (data && data.product) {
        const { product, variants } = data;

        const selectedVariant = variants.find(v => v.color === data.selectedColor);

        if (selectedVariant && selectedVariant.sizes.length === 1) {
          dispatch({
            type: 'SINGLE_SIZE',
            payload: {
              selectedSkuId: selectedVariant.sizes[0].skuId,
              quantity: selectedVariant.sizes[0].quantity,
            },
          });
        }

        dispatch({ type: 'SET_PRODUCT', payload: { product, variant: selectedVariant } });
        return { product, variant: selectedVariant };
      } else {
        dispatch({ type: 'CLEAR_PRODUCT' });
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      // Handle errors more gracefully in real scenarios
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      await getProduct();
    };

    fetchProduct();
  }, [slugId]);

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
