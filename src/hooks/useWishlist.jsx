import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'wishlist';

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setIds(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids]);

  const toggleWishlist = useCallback((productId) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]));
  }, []);

  const clearWishlist = useCallback(() => setIds([]), []);

  const value = useMemo(() => ({
    wishlistIds: ids,
    isWishlisted,
    toggleWishlist,
    clearWishlist,
  }), [ids, isWishlisted, toggleWishlist, clearWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
