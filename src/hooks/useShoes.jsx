import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api';

export const useShoes = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/shoes`);
      if (!response.ok) {
        throw new Error('Failed to fetch shoes');
      }
      const data = await response.json();
      setShoes(data.shoes || []);
    } catch (err) {
      console.error('Error fetching shoes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoes();
  }, [fetchShoes]);

  const refreshShoes = () => {
    fetchShoes();
  };

  const addShoe = async (shoeData) => {
    try {
      const response = await fetch(`${API_URL}/shoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shoeData),
      });
      if (!response.ok) throw new Error('Failed to add shoe');
      const data = await response.json();
      await fetchShoes();
      return data;
    } catch (err) {
      console.error('Error adding shoe:', err);
      throw err;
    }
  };

  const updateShoe = async (id, shoeData) => {
    try {
      const response = await fetch(`${API_URL}/shoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shoeData),
      });
      if (!response.ok) throw new Error('Failed to update shoe');
      const data = await response.json();
      await fetchShoes();
      return data;
    } catch (err) {
      console.error('Error updating shoe:', err);
      throw err;
    }
  };

  const deleteShoe = async (id) => {
    try {
      const response = await fetch(`${API_URL}/shoes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete shoe');
      await fetchShoes();
      return true;
    } catch (err) {
      console.error('Error deleting shoe:', err);
      throw err;
    }
  };

  return { shoes, loading, error, refreshShoes, addShoe, updateShoe, deleteShoe };
};
