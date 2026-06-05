import React, { useState } from 'react';
import { sampleProducts } from './ProductList';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Trash2, CreditCard, Truck, CheckCircle, ShoppingBag, Loader2, Plus, Minus } from 'lucide-react';

export default function CartView({
  cart,
  onAddToCart,
  onDecreaseCart,
  onClearCart,
  onBackToShopping,
  user,
  onPlaceOrder
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Shipping Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: user ? user.name : '',
    street: '',
    city: '',
    zip: '',
    phone: ''
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    method: 'card', // 'card', 'paypal', 'upi'
    cardName: user ? user.name : '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  // Get active items in the cart
  const cartItems = Object.keys(cart)
    .map((id) => {
      const product = sampleProducts.find((p) => p.id === parseInt(id));
      const qty = cart[id];
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  // Price calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal > 150 ? subtotal * 0.1 : 0; // 10% off for orders over $150
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.00; // Free shipping over $100
  const tax = (subtotal - discount) * 0.08; // 8% sales tax
  const total = subtotal - discount + shipping + tax;

  const handleQtyChange = (itemId, change) => {
    if (change > 0) {
      onAddToCart(itemId);
    } else {
      onDecreaseCart(itemId);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!addressForm.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!addressForm.street.trim()) errors.street = 'Street Address is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.zip.trim()) errors.zip = 'ZIP/Postal code is required';
    if (!addressForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(addressForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!agreedToTerms) {
      errors.agreedToTerms = 'You must agree to the Terms and Conditions to proceed';
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddressErrors({});
    setStep(3); // Proceed to Payment
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (paymentForm.method === 'card') {
      if (!paymentForm.cardName.trim()) errors.cardName = 'Cardholder name is required';
      if (!/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s+/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentForm.cardExpiry)) {
        errors.cardExpiry = 'Expiry must be in MM/YY format';
      }
      if (!/^\d{3}$/.test(paymentForm.cardCvv)) {
        errors.cardCvv = 'CVV must be 3 digits';
      }
    }

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }

    setPaymentErrors({});
    setIsProcessing(true);

    // Simulate API delay for placing the order
    setTimeout(() => {
      setIsProcessing(false);
      const generatedId = 'SH-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(1000 + Math.random() * 9000);
      setOrderId(generatedId);
      
      const newOrder = {
        id: generatedId,
        date: new Date().toISOString().split('T')[0],
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image
        })),
        address: { ...addressForm },
        status: 'Processing',
        total: total
      };

      if (onPlaceOrder) {
        onPlaceOrder(newOrder);
      }

      setStep(4); // Order Confirmed
    }, 2000);
  };

  const handleCompleteOrder = () => {
    onClearCart();
    onBackToShopping();
  };

  return (
    <div className="cart-page-container">
      {/* Checkout Steps Progress */}
      {step < 4 && (
        <div className="checkout-progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Review Cart</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Delivery Address</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      )}

      {/* Back Button */}
      {step === 1 && (
        <button className="cart-back-btn" onClick={onBackToShopping}>
          <ArrowLeft size={16} />
          Continue Shopping
        </button>
      )}

      {/* Step 1: Cart Items Grid */}
      {step === 1 && (
        <div className="checkout-layout">
          <div className="checkout-main-content">
            <h2 className="checkout-title">Your Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h3>Your cart is empty</h3>
                <p>Add some products from our catalogue to get started.</p>
                <button className="checkout-btn-primary" onClick={onBackToShopping}>
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-img-box">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </div>
                    
                    <div className="cart-item-details">
                      <span className="cart-item-cat">{t(`categories.${item.category}`)}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">{t('products.pricePrefix')}{item.price}</p>
                      <span className="cart-item-breakdown" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Qty: {item.qty} × {t('products.pricePrefix')}{item.price} = {t('products.pricePrefix')}{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button
                          className="qty-btn decrease"
                          onClick={() => handleQtyChange(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.qty}</span>
                        <button
                          className="qty-btn increase"
                          onClick={() => handleQtyChange(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="cart-item-subtotal">
                        {t('products.pricePrefix')}{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="checkout-sidebar">
              <div className="checkout-summary-card">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{t('products.pricePrefix')}{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>10% Discount (Over $150)</span>
                    <span>-{t('products.pricePrefix')}{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `${t('products.pricePrefix')}${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax (8%)</span>
                  <span>{t('products.pricePrefix')}{tax.toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Order Total</span>
                  <span>{t('products.pricePrefix')}{total.toFixed(2)}</span>
                </div>

                <button className="checkout-btn-primary" onClick={() => setStep(2)}>
                  Proceed to Shipping
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Shipping/Delivery Address Form */}
      {step === 2 && (
        <div className="checkout-layout">
          <div className="checkout-main-content">
            <h2 className="checkout-title">Shipping & Delivery Details</h2>
            <form id="address-form" onSubmit={handleAddressSubmit} className="checkout-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-input ${addressErrors.fullName ? 'error' : ''}`}
                    placeholder="Enter full name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
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
                    placeholder="Apartment, suite, unit, building, street, etc."
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
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
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                  {addressErrors.city && <span className="field-error-msg">{addressErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input
                    type="text"
                    className={`form-input ${addressErrors.zip ? 'error' : ''}`}
                    placeholder="e.g. 10001"
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
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
                    placeholder="e.g. +1 555 123 4567"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  />
                  {addressErrors.phone && <span className="field-error-msg">{addressErrors.phone}</span>}
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '0.5rem' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    I agree to the <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms and Conditions: Simulated terms and conditions agreement."); }} style={{ color: 'var(--accent-red)', textDecoration: 'underline' }}>Terms and Conditions</a> and privacy policy
                  </span>
                </label>
              </div>
              {addressErrors.agreedToTerms && <span className="field-error-msg" style={{ marginTop: '0.2rem' }}>{addressErrors.agreedToTerms}</span>}

              <div className="checkout-actions-row">
                <button type="button" className="checkout-btn-secondary" onClick={() => setStep(1)}>
                  Back to Cart
                </button>
                <button type="submit" className="checkout-btn-primary">
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>

          <div className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Summary</h3>
              <div className="summary-row">
                <span>Items Count</span>
                <span>{cartItems.reduce((acc, x) => acc + x.qty, 0)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Cost</span>
                <span>{shipping === 0 ? 'FREE' : `${t('products.pricePrefix')}${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>{t('products.pricePrefix')}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Form */}
      {step === 3 && (
        <div className="checkout-layout">
          <div className="checkout-main-content">
            <h2 className="checkout-title">Choose Payment Method</h2>
            
            <div className="payment-methods-selector">
              <label className={`payment-method-option ${paymentForm.method === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentForm.method === 'card'}
                  onChange={() => setPaymentForm({ ...paymentForm, method: 'card' })}
                  className="hidden-radio"
                />
                <CreditCard size={20} />
                <span>Credit / Debit Card</span>
              </label>

              <label className={`payment-method-option ${paymentForm.method === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentForm.method === 'paypal'}
                  onChange={() => setPaymentForm({ ...paymentForm, method: 'paypal' })}
                  className="hidden-radio"
                />
                <Truck size={20} />
                <span>PayPal Express</span>
              </label>

              <label className={`payment-method-option ${paymentForm.method === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentForm.method === 'upi'}
                  onChange={() => setPaymentForm({ ...paymentForm, method: 'upi' })}
                  className="hidden-radio"
                />
                <ShoppingBag size={20} />
                <span>UPI / Cash on Delivery</span>
              </label>
            </div>

            {paymentForm.method === 'card' ? (
              <form id="payment-form" onSubmit={handlePaymentSubmit} className="checkout-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className={`form-input ${paymentErrors.cardName ? 'error' : ''}`}
                      placeholder="Enter name on card"
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                    />
                    {paymentErrors.cardName && <span className="field-error-msg">{paymentErrors.cardName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      maxLength="19"
                      className={`form-input ${paymentErrors.cardNumber ? 'error' : ''}`}
                      placeholder="1234 5678 1234 5678"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setPaymentForm({ ...paymentForm, cardNumber: val });
                      }}
                    />
                    {paymentErrors.cardNumber && <span className="field-error-msg">{paymentErrors.cardNumber}</span>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      maxLength="5"
                      className={`form-input ${paymentErrors.cardExpiry ? 'error' : ''}`}
                      placeholder="MM/YY"
                      value={paymentForm.cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) {
                          val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        }
                        setPaymentForm({ ...paymentForm, cardExpiry: val });
                      }}
                    />
                    {paymentErrors.cardExpiry && <span className="field-error-msg">{paymentErrors.cardExpiry}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      maxLength="3"
                      className={`form-input ${paymentErrors.cardCvv ? 'error' : ''}`}
                      placeholder="123"
                      value={paymentForm.cardCvv}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardCvv: e.target.value.replace(/\D/g, '') })}
                    />
                    {paymentErrors.cardCvv && <span className="field-error-msg">{paymentErrors.cardCvv}</span>}
                  </div>
                </div>

                <div className="checkout-actions-row">
                  <button type="button" className="checkout-btn-secondary" onClick={() => setStep(2)}>
                    Back to Shipping
                  </button>
                  <button type="submit" className="checkout-btn-primary" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${t('products.pricePrefix')}${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="payment-alternative-details">
                {paymentForm.method === 'paypal' ? (
                  <p>You will be redirected to PayPal to complete your purchase securely.</p>
                ) : (
                  <p>You can pay via UPI QR code or cash at the time of delivery. A standard delivery verification call will be made.</p>
                )}
                
                <div className="checkout-actions-row" style={{ marginTop: '2rem' }}>
                  <button type="button" className="checkout-btn-secondary" onClick={() => setStep(2)}>
                    Back to Shipping
                  </button>
                  <button type="button" className="checkout-btn-primary" onClick={handlePaymentSubmit} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" />
                        Placing Order...
                      </>
                    ) : (
                      'Complete Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Delivery Address</h3>
              <div className="delivery-address-preview">
                <strong>{addressForm.fullName}</strong>
                <p>{addressForm.street}</p>
                <p>{addressForm.city}, {addressForm.zip}</p>
                <p>{addressForm.phone}</p>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Pay Amount</span>
                <span>{t('products.pricePrefix')}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Success Screen */}
      {step === 4 && (
        <div className="order-success-card">
          <div className="success-icon-wrapper">
            <CheckCircle size={80} className="success-icon" />
          </div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-subtitle">Thank you for shopping with us, {addressForm.fullName}!</p>
          
          <div className="order-info-box">
            <div className="info-row">
              <span>Order Number</span>
              <strong className="order-number">{orderId}</strong>
            </div>
            <div className="info-row">
              <span>Delivery Address</span>
              <span>{addressForm.street}, {addressForm.city} - {addressForm.zip}</span>
            </div>
            <div className="info-row">
              <span>Estimated Delivery</span>
              <span>2-4 Business Days</span>
            </div>
            <div className="info-row">
              <span>Payment Mode</span>
              <span>{paymentForm.method === 'card' ? 'Credit Card' : paymentForm.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</span>
            </div>
          </div>

          <p className="success-notice">
            A confirmation email has been sent to <strong>{user ? user.email : 'your email address'}</strong>.
          </p>

          <button className="checkout-btn-primary success-home-btn" onClick={handleCompleteOrder}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
