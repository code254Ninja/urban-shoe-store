import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const MAX_TOASTS = 3;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const notify = useCallback((toast) => {
    const id = toast.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const durationMs = typeof toast.durationMs === 'number' ? toast.durationMs : 2500;

    setToasts((prev) => {
      const next = [{ ...toast, id }, ...prev];
      return next.slice(0, MAX_TOASTS);
    });

    if (durationMs > 0) {
      const timer = setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const value = useMemo(() => ({
    toasts,
    notify,
    dismiss,
  }), [toasts, notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
