import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (directory, { currentFiles, newFiles }) => {
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      newFiles.forEach(file => {
        if (file.type.match(`image.*`)) {
          formData.append('files', file, file.name);
        }
      });
      formData.append('directory', directory);

      const response = await axios.post('/api/uploadFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsLoading(false);
      return response.data.updatedFiles; // Assume API returns the updated files array
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.message || 'An error occurred during file upload');
      setIsLoading(false);
    }
  };

  // The rest of your functions will also need to be updated similarly

  return {
    uploadFiles,
    isLoading,
    error,
  };
};
