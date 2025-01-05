import { useState, useRef } from 'react';
import API from '../API/axiosConfig';  // Ensure Axios is imported
import { v4 as uuid } from 'uuid';

import { formatDiscountNumber } from 'helpers/format';

export const useCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const latestDoc = useRef();

  const getCollection = async ({
    collectionName = 'products',
    isNewQuery = true,
    sortBy = { field: 'createdAt', direction: 'asc' },
    limit = 4
  }) => {
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = `/products`;
      const params = {
        sortBy: sortBy.field,
        direction: sortBy.direction,
        startAfter: isNewQuery ? 0 : latestDoc.current,
        limit
      };

      const { data } = await API.get(endpoint);
 console.log(data);
      if (data.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return [];
      }

   

      const products = data.map(product => ({
        ...product,
        id: uuid(),  // Generate UUID for each product
        
      }));

      setIsLoading(false);
      return products;
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err);
      setIsLoading(false);
      return [];
    }
  };

  return { getCollection, isLoading, hasMore, error };
};
