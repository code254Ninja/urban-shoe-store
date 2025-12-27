import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CompareContext = createContext(null);

const MAX_COMPARE = 3;

export const CompareProvider = ({ children }) => {
  const [compareIds, setCompareIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCompare = useCallback((productId) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, productId];
    });
    setIsOpen(true);
  }, []);

  const removeFromCompare = useCallback((productId) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const openCompare = useCallback(() => setIsOpen(true), []);
  const closeCompare = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({
    compareIds,
    isCompareOpen: isOpen,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    openCompare,
    closeCompare,
    maxCompare: MAX_COMPARE,
  }), [compareIds, isOpen, toggleCompare, removeFromCompare, clearCompare, openCompare, closeCompare]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
};
