import { X } from 'lucide-react';
import { useToast } from '../hooks/useToast.jsx';

const variantStyles = {
  success: 'border-green-200 bg-white',
  error: 'border-red-200 bg-white',
  info: 'border-gray-200 bg-white',
};

const titleStyles = {
  success: 'text-green-700',
  error: 'text-red-700',
  info: 'text-gray-900',
};

const ToastViewport = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[60] w-full max-w-sm space-y-2 px-4 sm:px-0">
      {toasts.map((t) => {
        const variant = t.variant ?? 'info';
        return (
          <div
            key={t.id}
            className={`card border ${variantStyles[variant] ?? variantStyles.info} shadow-lg overflow-hidden animate-toast-in`}
            role="status"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  {t.title && (
                    <div className={`text-sm font-semibold ${titleStyles[variant] ?? titleStyles.info}`}>
                      {t.title}
                    </div>
                  )}
                  {t.message && (
                    <div className="text-sm text-gray-600 mt-0.5">
                      {t.message}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastViewport;
