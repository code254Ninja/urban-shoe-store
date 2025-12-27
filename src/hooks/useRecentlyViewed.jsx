import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RecentlyViewedContext = createContext(null);

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 12;

export const RecentlyViewedProvider = ({ children }) => {
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

  const trackView = useCallback((productId) => {
    setIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => setIds([]), []);

  const value = useMemo(() => ({
    recentlyViewedIds: ids,
    trackView,
    clearRecentlyViewed,
  }), [ids, trackView, clearRecentlyViewed]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return ctx;
};
