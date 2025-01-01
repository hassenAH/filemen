import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

export const useSeed = (products) => {  // Assume products is passed as a prop or defined elsewhere
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadProducts = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Assuming you have an endpoint to handle product batch uploads
      await axios.post('/api/products/batch-upload', {
        products: products,
      });
      setIsLoading(false);
    } catch (err) {
      console.error('Error uploading products:', err);
      setError(err);
      setIsLoading(false);
    }
  };

  return { uploadProducts, isLoading, error };
};
