import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import API from '../API/axiosConfig';

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async ({ productDetails, images }) => {
    setError(null);
    setIsLoading(true);
  
    try {
      const formData = new FormData();
  
      // Append product details as JSON string
      formData.append('productDetails', JSON.stringify(productDetails));
  
      // Append image files
      images.forEach((file) => {
        if (file.type.match(`image.*`)) {
          formData.append('images', file, file.name);
        }
      });
  
      // Send the combined form data
      const response = await API.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setIsLoading(false);
      return response.data; // Return the created product response
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'An error occurred during product creation');
      setIsLoading(false);
    }
  };
  
  return {
  
    createProduct,
    isLoading,
    error,
  };
};
