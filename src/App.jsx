import React, { useState } from 'react';
import Header from './components/Header';
import CategoriesBar from './components/CategoriesBar';
import HeroBanner from './components/HeroBanner';
import FilterSidebar from './components/FilterSidebar';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Star, Heart, ShoppingCart, X } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('New York, USA');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filter States
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(null);

  // User & E-commerce States
  const [cart, setCart] = useState([]); // Array of product IDs
  const [wishlist, setWishlist] = useState([]); // Array of product IDs
  const [user, setUser] = useState(null); // User object { name, email }

  // Modal States
  const [authModal, setAuthModal] = useState({ isOpen: false, initialTab: 'login' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Notification Toast State
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const triggerToast = (message, type = 'default') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleClearFilters = () => {
    setPriceRange(1000);
    setSelectedRating(null);
    setActiveCategory('all');
    triggerToast('Filters cleared', 'success');
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        triggerToast(t('products.wishlistRemoved'), 'default');
        return prev.filter((id) => id !== productId);
      } else {
        triggerToast(t('products.wishlistAdded'), 'success');
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (productId) => {
    setCart((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        triggerToast(t('products.addedToCart'), 'success');
        return prev; // For simulated UI, we just mark it as added/increased
      } else {
        triggerToast(t('products.addedToCart'), 'success');
        return [...prev, productId];
      }
    });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    triggerToast(`${t('auth.successLogin')} Welcome, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    triggerToast('Logged out successfully.', 'default');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        cartCount={cart.length}
        user={user}
        onLogout={handleLogout}
        onOpenAuthModal={(tab) => setAuthModal({ isOpen: true, initialTab: tab })}
      />

      {/* Categories Horizontal Bar */}
      <CategoriesBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Hero Banner (Promo Slider) */}
      <HeroBanner />

      {/* Main Grid: Sidebar + Product Grid */}
      <main className="main-layout">
        <FilterSidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onClearFilters={handleClearFilters}
        />
        
        <ProductList
          searchQuery={searchQuery}
          priceRange={priceRange}
          selectedRating={selectedRating}
          activeCategory={activeCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          addedItems={cart}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.initialTab}
        onClose={() => setAuthModal({ isOpen: false, initialTab: 'login' })}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Quick View Modal Overlay */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
              <X size={18} />
            </button>
            <div className="modal-body">
              <div className="qv-details">
                <div className="qv-image-box">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="qv-img" />
                </div>
                
                <div className="qv-info-box">
                  <span className="product-category">{t(`categories.${quickViewProduct.category}`)}</span>
                  <h3 className="qv-title">{quickViewProduct.name}</h3>
                  
                  <div className="product-rating-row">
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(quickViewProduct.rating) ? '#ffb800' : 'transparent'}
                          stroke={i < Math.floor(quickViewProduct.rating) ? '#ffb800' : 'currentColor'}
                        />
                      ))}
                    </div>
                    <span className="rating-count">({quickViewProduct.reviewsCount} {t('products.reviews')})</span>
                  </div>

                  <div className="qv-price-row">
                    <span className="qv-price">{t('products.pricePrefix')}{quickViewProduct.price}</span>
                    {quickViewProduct.originalPrice && (
                      <span className="product-price-original" style={{ fontSize: '1.1rem' }}>
                        {t('products.pricePrefix')}{quickViewProduct.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="qv-desc">{quickViewProduct.description}</p>

                  <div className="qv-meta">
                    <span>Availability: <strong style={{ color: '#34c759' }}>{t('products.inStock')}</strong></span>
                    <span>Brand: <strong>Shopifyy Premium</strong></span>
                  </div>

                  <div className="qv-action-row">
                    <button
                      className="qv-cart-btn"
                      onClick={() => {
                        handleAddToCart(quickViewProduct.id);
                        setQuickViewProduct(null);
                      }}
                    >
                      <ShoppingCart size={18} />
                      {t('products.addToCart')}
                    </button>
                    <button
                      className={`qv-wishlist-btn ${wishlist.includes(quickViewProduct.id) ? 'active' : ''}`}
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      aria-label="Wishlist"
                    >
                      <Heart size={18} fill={wishlist.includes(quickViewProduct.id) ? 'var(--accent-red)' : 'transparent'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Containers */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'success' ? 'toast-success' : ''}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
