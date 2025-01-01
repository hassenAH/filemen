import { useState, useRef } from 'react';
import axios from 'axios';  // Ensure Axios is imported
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
      const endpoint = `/api/collections/${collectionName}`;
      const params = {
        sortBy: sortBy.field,
        direction: sortBy.direction,
        startAfter: isNewQuery ? 0 : latestDoc.current,
        limit
      };

      const { data } = await axios.get(endpoint, { params });

      if (data.products.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return [];
      }

      latestDoc.current = data.products[data.products.length - 1].id;

      const products = data.products.map(product => ({
        ...product,
        id: uuid(),  // Generate UUID for each product
        allVariants: product.variants  // Assume variants are included in the response
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
