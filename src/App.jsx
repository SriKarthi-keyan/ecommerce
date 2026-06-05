import React, { useState } from 'react';
import Header from './components/Header';
import CategoriesBar from './components/CategoriesBar';
import HeroBanner from './components/HeroBanner';
import FilterSidebar from './components/FilterSidebar';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartView from './components/CartView';
import ProfileView from './components/ProfileView';
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
  const [cart, setCart] = useState({}); // Mapping of product ID to quantity
  const [wishlist, setWishlist] = useState([]); // Array of product IDs
  const [user, setUser] = useState(null); // User object { name, email }

  // Modal States
  const [authModal, setAuthModal] = useState({ isOpen: false, initialTab: 'login' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // View & Redirect States
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'cart'
  const [pendingRedirectToCart, setPendingRedirectToCart] = useState(false);

  // Orders & Addresses States
  const [orders, setOrders] = useState([
    {
      id: 'SH-829301-2938',
      date: '2026-06-01',
      items: [
        {
          id: 3,
          name: 'Titan Pro Ergonomic Gaming Mouse',
          price: 79.99,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80'
        }
      ],
      address: {
        fullName: 'Manikandan A',
        street: '456 Tech Park Ave',
        city: 'New York',
        zip: '10001',
        phone: '+1 555 892 0182'
      },
      status: 'Delivered',
      total: 86.39
    }
  ]);

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      fullName: 'Manikandan A',
      street: '456 Tech Park Ave',
      city: 'New York',
      zip: '10001',
      phone: '+1 555 892 0182'
    }
  ]);

  // Notification Toast State
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const triggerToast = (message, type = 'default') => {
    const id = Math.random().toString(36).substring(2, 9) + '-' + Date.now();
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
      const currentQty = prev[productId] || 0;
      triggerToast(t('products.addedToCart'), 'success');
      return {
        ...prev,
        [productId]: currentQty + 1,
      };
    });
  };

  const handleDecreaseCart = (productId) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      if (currentQty <= 1) {
        const nextCart = { ...prev };
        delete nextCart[productId];
        triggerToast('Removed from cart', 'default');
        return nextCart;
      } else {
        triggerToast('Cart updated', 'success');
        return {
          ...prev,
          [productId]: currentQty - 1,
        };
      }
    });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    triggerToast(`${t('auth.successLogin')} Welcome, ${userData.name}!`, 'success');
    if (pendingRedirectToCart) {
      setCurrentView('cart');
      setPendingRedirectToCart(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setPendingRedirectToCart(false);
    triggerToast('Logged out successfully.', 'default');
  };

  const handleCartClick = () => {
    if (!user) {
      setPendingRedirectToCart(true);
      setAuthModal({ isOpen: true, initialTab: 'login' });
      triggerToast('Please log in to view your cart', 'default');
    } else {
      setCurrentView('cart');
    }
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handlePlaceOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSavedAddresses((prev) => {
      const exists = prev.some(
        (addr) =>
          addr.street.toLowerCase() === newOrder.address.street.toLowerCase() &&
          addr.zip === newOrder.address.zip
      );
      if (exists) return prev;
      return [
        ...prev,
        {
          id: Date.now(),
          ...newOrder.address
        }
      ];
    });
  };

  const handleAddAddress = (newAddr) => {
    setSavedAddresses((prev) => [...prev, newAddr]);
    triggerToast('Address added successfully', 'success');
  };

  const handleDeleteAddress = (addressId) => {
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    triggerToast('Address deleted', 'default');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUser((prev) => ({
      ...prev,
      name: updatedProfile.name,
      email: updatedProfile.email
    }));
    triggerToast('Profile updated successfully', 'success');
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
        onOpenAuthModal={(tab) => setAuthModal({ isOpen: true, initialTab: tab })}
        onCartClick={handleCartClick}
        onProfileClick={() => setCurrentView('profile')}
      />

      {/* Categories Horizontal Bar */}
      {currentView === 'home' && (
        <CategoriesBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      {currentView === 'home' ? (
        <>
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
              onDecreaseCart={handleDecreaseCart}
              onQuickView={setQuickViewProduct}
              cart={cart}
            />
          </main>
        </>
      ) : currentView === 'cart' ? (
        <CartView
          cart={cart}
          onAddToCart={handleAddToCart}
          onDecreaseCart={handleDecreaseCart}
          onClearCart={handleClearCart}
          onBackToShopping={() => setCurrentView('home')}
          user={user}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : (
        <ProfileView
          user={user}
          onLogout={handleLogout}
          onBackToShopping={() => setCurrentView('home')}
          orders={orders}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          cart={cart}
          savedAddresses={savedAddresses}
          onAddAddress={handleAddAddress}
          onDeleteAddress={handleDeleteAddress}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

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
                    <span>Brand: <strong>Nexacart Premium</strong></span>
                  </div>

                  <div className="qv-action-row">
                    {cart[quickViewProduct.id] > 0 ? (
                      <div className="quantity-selector qv-qty-selector">
                        <button
                          className="qty-btn decrease"
                          onClick={() => handleDecreaseCart(quickViewProduct.id)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-val">{cart[quickViewProduct.id]}</span>
                        <button
                          className="qty-btn increase"
                          onClick={() => handleAddToCart(quickViewProduct.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="qv-cart-btn"
                        onClick={() => {
                          handleAddToCart(quickViewProduct.id);
                        }}
                      >
                        <ShoppingCart size={18} />
                        {t('products.addToCart')}
                      </button>
                    )}
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
            <span>{toast.message}</span>
            <button
              className="toast-close-btn"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
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
