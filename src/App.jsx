import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './hooks/useCart.jsx';
import { useCart } from './hooks/useCart.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import { WishlistProvider } from './hooks/useWishlist.jsx';
import { RecentlyViewedProvider } from './hooks/useRecentlyViewed.jsx';
import { CompareProvider } from './hooks/useCompare.jsx';
import { useShoes } from './hooks/useShoes.jsx';
import { useWishlist } from './hooks/useWishlist.jsx';
import { useRecentlyViewed } from './hooks/useRecentlyViewed.jsx';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import Filters from './components/Filters';
import ToastViewport from './components/ToastViewport.jsx';
import CompareDrawer from './components/CompareDrawer.jsx';
import EdgeShoes from './components/EdgeShoes.jsx';
import ProductSlider from './components/ProductSlider.jsx';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import WishlistPage from './components/WishlistPage.jsx';

function StoreFront({ onQuickView }) {
  const { shoes } = useShoes();
  const { items: cartItems } = useCart();
  const { wishlistIds } = useWishlist();
  const { recentlyViewedIds } = useRecentlyViewed();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [dealEndsAt] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 36);
    return d;
  });
  const [dealRemaining, setDealRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 300],
    sizes: []
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ms = Math.max(0, dealEndsAt.getTime() - now.getTime());
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;
      setDealRemaining({ days, hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dealEndsAt]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = shoes.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = filters.category === 'all' || 
                             product.category.toLowerCase() === filters.category.toLowerCase();

      // Brand filter
      const matchesBrand = filters.brand === 'all' || 
                          product.brand.toLowerCase() === filters.brand.toLowerCase();

      // Price filter
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];

      // Size filter
      const matchesSize = filters.sizes.length === 0 || 
                         filters.sizes.some(size => product.sizes.includes(size));

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesSize;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [shoes, searchQuery, filters, sortBy]);

  const featured = useMemo(() => shoes.filter((p) => Array.isArray(p.tags) && p.tags.includes('featured')).slice(0, 6), [shoes]);

  const newArrivals = useMemo(() => {
    const tagged = shoes.filter((p) => Array.isArray(p.tags) && p.tags.includes('new'));
    return (tagged.length ? tagged : [...shoes].sort((a, b) => b.id - a.id)).slice(0, 6);
  }, [shoes]);

  const bestSellers = useMemo(() => {
    const tagged = shoes.filter((p) => Array.isArray(p.tags) && p.tags.includes('bestseller'));
    return (tagged.length ? tagged : [...shoes].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))).slice(0, 6);
  }, [shoes]);

  const edgeImages = useMemo(() => {
    const unique = [];
    const seen = new Set();
    for (const p of shoes) {
      if (!p?.image) continue;
      if (seen.has(p.image)) continue;
      seen.add(p.image);
      unique.push(p.image);
      if (unique.length >= 6) break;
    }
    return unique;
  }, [shoes]);

  const recentlyViewed = useMemo(() => {
    if (!recentlyViewedIds.length) return [];
    const byId = new Map(shoes.map((s) => [s.id, s]));
    return recentlyViewedIds.map((id) => byId.get(id)).filter(Boolean).slice(0, 6);
  }, [shoes, recentlyViewedIds]);

  // Combined unique products for single carousel
  const allHighlightedProducts = useMemo(() => {
    const seen = new Set();
    const combined = [];
    
    // Add products in order of priority, avoiding duplicates
    const addUnique = (products) => {
      for (const p of products) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          combined.push(p);
        }
      }
    };
    
    addUnique(featured);
    addUnique(newArrivals);
    addUnique(bestSellers);
    addUnique(recentlyViewed);
    
    return combined;
  }, [featured, newArrivals, bestSellers, recentlyViewed]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
          <EdgeShoes images={edgeImages} />
          <div className="relative z-10">
          <Header 
            onCartClick={handleCartClick}
            onSearchChange={handleSearchChange}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Promo Banner */}
            <div className="card mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="text-sm font-semibold tracking-wide uppercase text-white/90">Limited time deal</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-1">Free shipping + extra 15% off</h1>
                    <p className="text-white/90 mt-2 max-w-2xl">Use code <span className="font-semibold">URBANSOLE15</span> at checkout. Fresh drops, best sellers, and everyday classics.</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 sm:p-5">
                    <div className="text-sm font-semibold text-white/90">Deal ends in</div>
                    <div className="mt-2 grid grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold">{dealRemaining.days}</div>
                        <div className="text-xs text-white/80">Days</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{dealRemaining.hours}</div>
                        <div className="text-xs text-white/80">Hours</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{dealRemaining.minutes}</div>
                        <div className="text-xs text-white/80">Min</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{dealRemaining.seconds}</div>
                        <div className="text-xs text-white/80">Sec</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Carousel */}
            {allHighlightedProducts.length > 0 && (
              <div className="mb-12">
                <ProductSlider
                  products={allHighlightedProducts}
                  onQuickView={onQuickView}
                  title="Discover Our Collection"
                  subtitle="Featured, new arrivals, best sellers & more"
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <Filters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Sort and Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {searchQuery ? `Search Results for "${searchQuery}"` : 'All Shoes'}
                    </h2>
                    <p className="text-gray-600">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                    </p>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={onQuickView}
                        animationDelayMs={idx * 25}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Cart Sidebar */}
          <CartSidebar
            isOpen={isCartOpen}
            onClose={handleCloseCart}
          />
          </div>
    </div>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <CompareProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<StoreFront onQuickView={handleQuickView} />} />
                    <Route path="/wishlist" element={<WishlistPage onQuickView={handleQuickView} />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
                <CompareDrawer />
                <ProductModal
                  product={selectedProduct}
                  isOpen={!!selectedProduct}
                  onClose={handleCloseModal}
                />
                <ToastViewport />
              </CompareProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
