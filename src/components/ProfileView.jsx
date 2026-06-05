import React, { useState } from 'react';
import { sampleProducts } from './ProductList';
import { useLanguage } from '../context/LanguageContext';
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight, ChevronDown, Plus, Trash2, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';

export default function ProfileView({
  user,
  onLogout,
  onBackToShopping,
  orders,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  cart,
  savedAddresses,
  onAddAddress,
  onDeleteAddress,
  onUpdateProfile
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'wishlist', 'addresses'
  
  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: '+1 555 892 0182',
    dob: '1995-10-15'
  });

  // Address add form states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: user ? user.name : '',
    street: '',
    city: '',
    zip: '',
    phone: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Order item expansion states
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter products for wishlist
  const wishlistedItems = sampleProducts.filter((product) => wishlist.includes(product.id));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileForm.name,
      email: profileForm.email
    });
    setIsEditingProfile(false);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newAddressForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!newAddressForm.street.trim()) errors.street = 'Street Address is required';
    if (!newAddressForm.city.trim()) errors.city = 'City is required';
    if (!newAddressForm.zip.trim()) errors.zip = 'ZIP/Postal code is required';
    if (!newAddressForm.phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    onAddAddress({
      id: Date.now(),
      ...newAddressForm
    });

    setNewAddressForm({
      fullName: user ? user.name : '',
      street: '',
      city: '',
      zip: '',
      phone: ''
    });
    setAddressErrors({});
    setIsAddingAddress(false);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="profile-page-container">
      {/* Page Header */}
      <div className="profile-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1rem' }}>
        <h2 className="profile-page-title" style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>My Account</h2>
        <button className="cart-back-btn" onClick={onBackToShopping} style={{ margin: 0 }}>
          <ArrowLeft size={16} />
          Back to Shopping
        </button>
      </div>

      <div className="profile-layout">
        {/* Left Sidebar Navigation */}
        <aside className="profile-sidebar-nav">
          <div className="profile-user-summary">
            <div className="profile-avatar">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-user-meta">
              <h4>{user ? user.name : 'Guest User'}</h4>
              <p>{user ? user.email : 'guest@example.com'}</p>
            </div>
          </div>

          <div className="profile-nav-menu">
            <button
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>My Profile</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>

            <button
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
              <span className="nav-badge">{orders.length}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>

            <button
              className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>My Wishlist</span>
              <span className="nav-badge">{wishlist.length}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>

            <button
              className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} />
              <span>Saved Addresses</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>

            <div className="profile-nav-divider"></div>

            <button className="profile-nav-item logout-nav-btn" onClick={onLogout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Panels */}
        <main className="profile-panel-content">
          {/* Tab 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="profile-panel-card">
              <div className="panel-header">
                <h3>Account Information</h3>
                {!isEditingProfile && (
                  <button className="panel-action-btn" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="checkout-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-input"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="checkout-actions-row">
                    <button type="button" className="checkout-btn-secondary" onClick={() => setIsEditingProfile(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="checkout-btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details-grid">
                  <div className="detail-card">
                    <div className="detail-icon-box">
                      <User size={18} />
                    </div>
                    <div className="detail-info-text">
                      <span className="detail-label">Full Name</span>
                      <strong className="detail-val">{user ? user.name : 'Guest User'}</strong>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-icon-box">
                      <Mail size={18} />
                    </div>
                    <div className="detail-info-text">
                      <span className="detail-label">Email Address</span>
                      <strong className="detail-val">{user ? user.email : 'guest@example.com'}</strong>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-icon-box">
                      <Phone size={18} />
                    </div>
                    <div className="detail-info-text">
                      <span className="detail-label">Phone Number</span>
                      <strong className="detail-val">{profileForm.phone}</strong>
                    </div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-icon-box">
                      <Calendar size={18} />
                    </div>
                    <div className="detail-info-text">
                      <span className="detail-label">Date of Birth</span>
                      <strong className="detail-val">{profileForm.dob}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Orders History */}
          {activeTab === 'orders' && (
            <div className="profile-panel-card">
              <div className="panel-header">
                <h3>Order History</h3>
              </div>

              {orders.length === 0 ? (
                <div className="panel-empty-state">
                  <ShoppingBag size={48} className="empty-icon" />
                  <h4>No orders placed yet</h4>
                  <p>Browse our catalog and start shopping!</p>
                  <button className="checkout-btn-primary" onClick={onBackToShopping} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="profile-orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-history-card">
                      <div className="order-card-header" onClick={() => toggleOrderExpand(order.id)}>
                        <div className="order-meta-info">
                          <span>Order ID: <strong className="text-accent">{order.id}</strong></span>
                          <span>Placed on: {order.date}</span>
                        </div>
                        <div className="order-price-status">
                          <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                          <span className="order-card-total">{t('products.pricePrefix')}{order.total.toFixed(2)}</span>
                          {expandedOrder === order.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-card-body">
                          <div className="order-products-list">
                            {order.items.map((item) => (
                              <div key={item.id} className="order-product-row">
                                <img src={item.image} alt={item.name} className="op-img" />
                                <div className="op-details">
                                  <h5>{item.name}</h5>
                                  <p>Qty: {item.qty} × {t('products.pricePrefix')}{item.price}</p>
                                </div>
                                <span className="op-subtotal">{t('products.pricePrefix')}{(item.price * item.qty).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-footer-details">
                            <div className="order-shipping-summary">
                              <strong>Delivery Address:</strong>
                              <p>{order.address.fullName}</p>
                              <p>{order.address.street}</p>
                              <p>{order.address.city}, {order.address.zip}</p>
                              <p>Phone: {order.address.phone}</p>
                            </div>
                            <div className="order-receipt-summary">
                              <div className="summary-row">
                                <span>Items Subtotal:</span>
                                <span>{t('products.pricePrefix')}{(order.total * 0.9).toFixed(2)}</span>
                              </div>
                              <div className="summary-row">
                                <span>Estimated Tax & Shipping:</span>
                                <span>{t('products.pricePrefix')}{(order.total * 0.1).toFixed(2)}</span>
                              </div>
                              <div className="summary-divider"></div>
                              <div className="summary-row total">
                                <span>Total Paid:</span>
                                <span>{t('products.pricePrefix')}{order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Wishlist Details */}
          {activeTab === 'wishlist' && (
            <div className="profile-panel-card">
              <div className="panel-header">
                <h3>My Wishlist</h3>
              </div>

              {wishlistedItems.length === 0 ? (
                <div className="panel-empty-state">
                  <Heart size={48} className="empty-icon" />
                  <h4>Your wishlist is empty</h4>
                  <p>Save items you like to view them later.</p>
                  <button className="checkout-btn-primary" onClick={onBackToShopping} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="profile-wishlist-grid">
                  {wishlistedItems.map((product) => {
                    const isAdded = cart[product.id] > 0;
                    return (
                      <div key={product.id} className="wishlist-item-card">
                        <button className="wishlist-remove-btn" onClick={() => onToggleWishlist(product.id)}>
                          <Trash2 size={16} />
                        </button>
                        <div className="wishlist-img-box">
                          <img src={product.image} alt={product.name} className="wishlist-img" />
                        </div>
                        <div className="wishlist-item-info">
                          <h4 className="wishlist-item-title">{product.name}</h4>
                          <span className="wishlist-item-price">{t('products.pricePrefix')}{product.price}</span>
                        </div>
                        <button
                          className={`wishlist-add-cart-btn ${isAdded ? 'added' : ''}`}
                          onClick={() => onAddToCart(product.id)}
                          disabled={isAdded}
                        >
                          {isAdded ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Saved Addresses Panel */}
          {activeTab === 'addresses' && (
            <div className="profile-panel-card">
              <div className="panel-header">
                <h3>Saved Delivery Addresses</h3>
                {!isAddingAddress && (
                  <button className="panel-action-btn flex-center gap-1" onClick={() => setIsAddingAddress(true)}>
                    <Plus size={16} /> Add Address
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddressSubmit} className="checkout-form">
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-input ${addressErrors.fullName ? 'error' : ''}`}
                        placeholder="Enter full name"
                        value={newAddressForm.fullName}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                      />
                      {addressErrors.fullName && <span className="field-error-msg">{addressErrors.fullName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        className={`form-input ${addressErrors.street ? 'error' : ''}`}
                        placeholder="Apartment, unit, street address, etc."
                        value={newAddressForm.street}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                      />
                      {addressErrors.street && <span className="field-error-msg">{addressErrors.street}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className={`form-input ${addressErrors.city ? 'error' : ''}`}
                        placeholder="e.g. New York"
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                      />
                      {addressErrors.city && <span className="field-error-msg">{addressErrors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">ZIP / Postal Code</label>
                      <input
                        type="text"
                        className={`form-input ${addressErrors.zip ? 'error' : ''}`}
                        placeholder="e.g. 10001"
                        value={newAddressForm.zip}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, zip: e.target.value })}
                      />
                      {addressErrors.zip && <span className="field-error-msg">{addressErrors.zip}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className={`form-input ${addressErrors.phone ? 'error' : ''}`}
                        placeholder="e.g. +1 555-0199"
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                      />
                      {addressErrors.phone && <span className="field-error-msg">{addressErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="checkout-actions-row">
                    <button type="button" className="checkout-btn-secondary" onClick={() => setIsAddingAddress(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="checkout-btn-primary">
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-addresses-grid">
                  {savedAddresses.length === 0 ? (
                    <div className="panel-empty-state">
                      <MapPin size={48} className="empty-icon" />
                      <h4>No addresses saved</h4>
                      <p>Add shipping locations to checkout faster next time.</p>
                    </div>
                  ) : (
                    savedAddresses.map((addr) => (
                      <div key={addr.id} className="saved-address-card">
                        <div className="address-card-header">
                          <strong>{addr.fullName}</strong>
                          <button className="address-delete-btn" onClick={() => onDeleteAddress(addr.id)} aria-label="Delete address">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="address-card-body">
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.zip}</p>
                          <p>Phone: {addr.phone}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
