import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, ShoppingCart, User, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  cartCount,
  user,
  onLogout,
  onOpenAuthModal
}) {
  const { t } = useLanguage();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const locationRef = useRef(null);
  const searchRef = useRef(null);

  const locations = [
    'New York, USA',
    'London, UK',
    'Mumbai, India',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia'
  ];

  const popularSuggestions = [
    'Wireless Headphones',
    'Mechanical Keyboard',
    'Smart Watch',
    'Leather Jacket',
    'Coffee Maker',
    'Running Shoes'
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (val) => {
    setSearchInput(val);
    setSearchQuery(val);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const filteredSuggestions = popularSuggestions.filter(item =>
    item.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Logo */}
        <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); handleClearSearch(); }}>
          <h1 className="logo-text">
            {t('appName')}<span className="logo-dot"></span>
          </h1>
        </a>

        {/* Location Selector */}
        <div className="location-picker" ref={locationRef} onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
          <MapPin size={18} className="location-icon" style={{ color: 'var(--accent-red)' }} />
          <div className="location-info">
            <span className="location-label">{t('selectLocation')}</span>
            <span className="location-value">{selectedLocation || t('defaultLocation')}</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          
          {showLocationDropdown && (
            <div className="location-dropdown-menu">
              {locations.map((loc) => (
                <div
                  key={loc}
                  className={`location-item ${selectedLocation === loc ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(loc);
                    setShowLocationDropdown(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-wrapper" ref={searchRef}>
          <form className="search-bar-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder={t('searchPlaceholder')}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          {showSuggestions && (searchInput || filteredSuggestions.length > 0) && (
            <div className="search-suggestions">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth / Cart Buttons */}
        <div className="header-actions">
          <button className="cart-icon-btn" aria-label="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-profile-btn" onClick={onLogout}>
              <User size={16} />
              <span>{user.name}</span>
              <LogOut size={14} style={{ marginLeft: '4px', color: 'var(--accent-red)' }} />
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => onOpenAuthModal('login')}>
                {t('login')}
              </button>
              <button className="signup-btn" onClick={() => onOpenAuthModal('signup')}>
                {t('signUp')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
