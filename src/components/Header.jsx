import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart, User, Shield } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';

const Header = ({ onCartClick, onSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Urban<span className="text-primary-600">Sole</span>
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for shoes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Men</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Women</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Sale</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Admin */}
            <button 
              onClick={() => navigate('/admin/login')}
              className="hidden md:flex p-2 text-gray-700 hover:text-primary-600"
              title="Admin Panel"
            >
              <Shield className="w-6 h-6" />
            </button>
            {/* Search - Mobile */}
            <button className="md:hidden p-2 text-gray-700 hover:text-primary-600">
              <Search className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            <button className="p-2 text-gray-700 hover:text-primary-600 relative">
              <Heart className="w-6 h-6" />
            </button>

            {/* Account */}
            <button className="p-2 text-gray-700 hover:text-primary-600">
              <User className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="p-2 text-gray-700 hover:text-primary-600 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for shoes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <a href="#" className="text-gray-700 hover:text-primary-600 font-medium py-2">Home</a>
                <a href="#" className="text-gray-700 hover:text-primary-600 font-medium py-2">Men</a>
                <a href="#" className="text-gray-700 hover:text-primary-600 font-medium py-2">Women</a>
                <a href="#" className="text-gray-700 hover:text-primary-600 font-medium py-2">Sale</a>
                <button 
                  onClick={() => navigate('/admin/login')}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
