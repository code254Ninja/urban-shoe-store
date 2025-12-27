import { useMemo } from 'react';
import { X, Scale } from 'lucide-react';
import { useShoes } from '../hooks/useShoes.jsx';
import { useCompare } from '../hooks/useCompare.jsx';

const CompareDrawer = () => {
  const { shoes } = useShoes();
  const { compareIds, isCompareOpen, closeCompare, removeFromCompare, clearCompare, maxCompare } = useCompare();

  const items = useMemo(() => {
    const byId = new Map(shoes.map((s) => [s.id, s]));
    return compareIds.map((id) => byId.get(id)).filter(Boolean);
  }, [shoes, compareIds]);

  if (!isCompareOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={closeCompare} />
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50 border-t border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <Scale className="w-5 h-5" />
              Compare ({items.length}/{maxCompare})
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button onClick={clearCompare} className="text-sm text-gray-600 hover:text-gray-900">
                  Clear
                </button>
              )}
              <button onClick={closeCompare} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">Add up to 3 shoes to compare.</div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {items.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.brand} • {p.category}</div>
                    </div>
                    <button onClick={() => removeFromCompare(p.id)} className="p-1 rounded-md hover:bg-gray-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">KES {p.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{p.rating}★</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div>Sizes: {p.sizes?.length ?? 0}</div>
                    <div>Colors: {p.colors?.length ?? 0}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompareDrawer;
