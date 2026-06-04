import React, { useState } from 'react';
import { Filter, Star, RotateCcw, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  activeCategory,
  setActiveCategory,
  onClearFilters
}) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const categoriesList = [
    { id: 'electronics', labelKey: 'categories.electronics' },
    { id: 'fashion', labelKey: 'categories.fashion' },
    { id: 'home', labelKey: 'categories.home' },
    { id: 'sports', labelKey: 'categories.sports' },
    { id: 'books', labelKey: 'categories.books' },
    { id: 'beauty', labelKey: 'categories.beauty' }
  ];

  const ratingOptions = [4, 3, 2];

  const handleCategoryCheckboxChange = (catId) => {
    if (activeCategory === catId) {
      setActiveCategory('all');
    } else {
      setActiveCategory(catId);
    }
  };

  return (
    <aside className="filter-sidebar">
      <div 
        className="filter-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', marginBottom: isOpen ? '1.8rem' : '0' }}
      >
        <h3 className="filter-title">
          <Filter size={18} style={{ color: 'var(--accent-red)' }} />
          {t('filters.title')}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {isOpen && (
            <button 
              className="clear-filter-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }} 
              aria-label="Clear all filters"
            >
              <RotateCcw size={12} style={{ marginRight: '4px' }} />
              {t('filters.clearAll')}
            </button>
          )}
          <ChevronDown 
            size={18} 
            style={{ 
              color: 'var(--text-secondary)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="filter-content-body" style={{ animation: 'fadeIn 0.25s ease' }}>
          {/* Categories Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">{t('categories.all')}</h4>
            <div className="checkbox-list">
              {categoriesList.map((cat) => (
                <label key={cat.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={activeCategory === cat.id}
                    onChange={() => handleCategoryCheckboxChange(cat.id)}
                  />
                  <span>{t(cat.labelKey)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">{t('filters.priceRange')}</h4>
            <div className="price-slider-group">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                className="price-slider"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="price-values">
                <span>{t('products.pricePrefix')}0</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>
                  {t('products.pricePrefix')}{priceRange}
                </span>
              </div>
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="filter-section" style={{ marginBottom: 0 }}>
            <h4 className="filter-section-title">{t('filters.rating')}</h4>
            <div className="checkbox-list">
              {ratingOptions.map((stars) => (
                <div
                  key={stars}
                  className={`rating-item ${selectedRating === stars ? 'active' : ''}`}
                  onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                >
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < stars ? '#ffb800' : 'transparent'}
                        stroke={i < stars ? '#ffb800' : 'currentColor'}
                      />
                    ))}
                  </div>
                  <span>& {t('filters.starsUp')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
