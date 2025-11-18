import { useState, useEffect } from 'react';
import { shoes as initialShoes } from '../data/shoes';

export const useShoes = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    // Load shoes from localStorage or start with empty array
    const storedShoes = localStorage.getItem('shoes');
    if (storedShoes) {
      try {
        setShoes(JSON.parse(storedShoes));
      } catch (error) {
        console.error('Error parsing stored shoes:', error);
        setShoes([]);
        localStorage.setItem('shoes', JSON.stringify([]));
      }
    } else {
      // Start with empty catalog - shoes will be added through admin panel
      setShoes([]);
      localStorage.setItem('shoes', JSON.stringify([]));
    }
  }, []);

  const refreshShoes = () => {
    const storedShoes = localStorage.getItem('shoes');
    if (storedShoes) {
      setShoes(JSON.parse(storedShoes));
    }
  };

  return { shoes, refreshShoes };
};
