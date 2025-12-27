import { useMemo, useState } from 'react';
import { Heart, Star, Plus, Scale } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useWishlist } from '../hooks/useWishlist.jsx';
import { useCompare } from '../hooks/useCompare.jsx';

const ProductCard = ({ product, onQuickView, animationDelayMs = 0, compact = false }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();
  const { notify } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { compareIds, toggleCompare, maxCompare } = useCompare();

  const liked = isWishlisted(product.id);
  const compareDisabled = useMemo(() => !compareIds.includes(product.id) && compareIds.length >= maxCompare, [compareIds, maxCompare, product.id]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor);
    notify({
      variant: 'success',
      title: 'Added to cart',
      message: `${product.name} • ${selectedSize} • ${selectedColor}`,
    });
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="card group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-up"
      onClick={handleQuickView}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${compact ? 'h-32' : 'h-64'}`}
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{discount}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const next = !liked;
            toggleWishlist(product.id);
            notify({
              variant: 'info',
              title: next ? 'Saved' : 'Removed',
              message: next ? 'Added to wishlist' : 'Removed from wishlist',
            });
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            liked 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (compareDisabled) {
              notify({
                variant: 'info',
                title: 'Compare limit reached',
                message: `You can compare up to ${maxCompare} shoes`,
              });
              return;
            }
            toggleCompare(product.id);
            const isInCompare = compareIds.includes(product.id);
            notify({
              variant: 'info',
              title: isInCompare ? 'Removed from compare' : 'Added to compare',
              message: product.name,
            });
          }}
          disabled={compareDisabled}
          className={`absolute top-3 right-14 p-2 rounded-full transition-colors ${
            compareDisabled ? 'bg-white text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title="Compare"
        >
          <Scale className="w-4 h-4" />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Brand and Name */}
        <div className="mb-2">
          <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-gray-500">Colors:</span>
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedColor === color ? 'border-primary-600' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                 color.toLowerCase() === 'black' ? '#000000' :
                                 color.toLowerCase() === 'red' ? '#ef4444' :
                                 color.toLowerCase() === 'blue' ? '#3b82f6' :
                                 color.toLowerCase() === 'green' ? '#10b981' :
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                 '#6b7280'
                }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">KES {product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
