import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useShoes } from '../hooks/useShoes.jsx';
import { useWishlist } from '../hooks/useWishlist.jsx';
import ProductCard from './ProductCard.jsx';

const WishlistPage = ({ onQuickView }) => {
  const { shoes } = useShoes();
  const { wishlistIds } = useWishlist();

  const wishlisted = useMemo(() => {
    const byId = new Map(shoes.map((s) => [s.id, s]));
    return wishlistIds.map((id) => byId.get(id)).filter(Boolean);
  }, [shoes, wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Wishlist
          </h2>
          <p className="text-gray-600">{wishlisted.length} item{wishlisted.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {wishlisted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlisted.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="mt-4 text-lg font-semibold text-gray-900">Your wishlist is empty</div>
          <div className="mt-1 text-gray-600">Save items you love and they’ll show up here.</div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
