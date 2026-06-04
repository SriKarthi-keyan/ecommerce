import React, { useState } from 'react';
import { Star, Heart, Plus, Search, Eye, LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const sampleProducts = [
  {
    id: 1,
    category: 'electronics',
    name: 'Nova Wireless ANC Headphones',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: 'Experience pure audio luxury with noise cancellation, memory-foam padding, and premium titanium drivers.',
    badge: 'Sale'
  },
  {
    id: 2,
    category: 'electronics',
    name: 'Aero Mechanical Keyboard',
    price: 129.99,
    rating: 4.6,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    description: 'Tactile hot-swappable red switches, customized RGB backlighting, and a premium aluminum build.',
  },
  {
    id: 3,
    category: 'electronics',
    name: 'Titan Pro Ergonomic Gaming Mouse',
    price: 79.99,
    rating: 4.7,
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    description: 'High-precision 26,000 DPI sensor, customizable side buttons, and lightweight construction for elite gaming.',
    badge: 'Popular'
  },
  {
    id: 4,
    category: 'fashion',
    name: 'Obsidian Premium Leather Jacket',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80',
    description: 'Handcrafted from 100% full-grain leather, featuring robust metal zippers and a comfortable inner lining.',
  },
  {
    id: 5,
    category: 'fashion',
    name: 'Crimson Edge Sports Sneakers',
    price: 149.99,
    rating: 4.5,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'Breathable flyknit mesh with responsive foam sole for premium support, sporting active red aesthetic borders.',
    badge: 'Trending'
  },
  {
    id: 6,
    category: 'home',
    name: 'Glass Infuser Teapot & Cups Set',
    price: 45.00,
    rating: 4.4,
    reviewsCount: 82,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    description: 'Heat-resistant borosilicate glass with micro-mesh stainless steel infuser for perfect loose leaf teas.',
  },
  {
    id: 7,
    category: 'home',
    name: 'Aura Ambient Glass Table Lamp',
    price: 89.00,
    rating: 4.6,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80',
    description: 'Hand-blown glass dome emitting warm atmospheric light. Supports multi-level smart dimming.',
  },
  {
    id: 8,
    category: 'sports',
    name: 'Stealth Waterproof Fitness Tracker',
    price: 119.99,
    rating: 4.3,
    reviewsCount: 154,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80',
    description: 'AMOLED display monitoring heart rate, oxygen levels, sleep cycles, and daily outdoor sport exercises.',
  },
  {
    id: 9,
    category: 'sports',
    name: 'Polarized Ultra-Sport Sunglasses',
    price: 59.00,
    rating: 4.5,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80',
    description: 'Anti-fog impact-resistant lenses block UV rays. Lightweight crimson rim frames designed for runners.',
  },
  {
    id: 10,
    category: 'books',
    name: 'Minimalist & Modern Design Handbook',
    price: 29.99,
    rating: 4.8,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80',
    description: 'A comprehensive handbook exploring typography, layout systems, and the aesthetic use of negative spaces.',
  },
  {
    id: 11,
    category: 'beauty',
    name: 'Organic Bamboo Charcoal Facial Kit',
    price: 39.99,
    rating: 4.7,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80',
    description: 'Detoxifying facial set with activated charcoal, white clay, and soothing organic tea extracts.',
  },
  {
    id: 12,
    category: 'beauty',
    name: 'Shopifyy Crimson Matte Lipstick',
    price: 24.99,
    rating: 4.6,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
    description: 'Long-lasting hydrating formula in signature bold crimson, presenting a smooth velvet finish.',
  }
];

export default function ProductList({
  searchQuery,
  priceRange,
  selectedRating,
  activeCategory,
  sortBy,
  setSortBy,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  addedItems
}) {
  const { t } = useLanguage();
  const [layoutMode, setLayoutMode] = useState('grid');

  // Filter products based on search, price, rating, and category
  const filteredProducts = sampleProducts.filter((product) => {
    // 1. Category Filter
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    // 2. Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) {
        return false;
      }
    }
    // 3. Price Filter
    if (product.price > priceRange) {
      return false;
    }
    // 4. Rating Filter
    if (selectedRating && product.rating < selectedRating) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'lowToHigh') {
      return a.price - b.price;
    }
    if (sortBy === 'highToLow') {
      return b.price - a.price;
    }
    if (sortBy === 'ratingDesc') {
      return b.rating - a.rating;
    }
    // default 'featured'
    return a.id - b.id;
  });

  return (
    <section className="products-content">
      <div className="products-bar">
        <span className="products-count">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="layout-toggles">
            <button
              className={`layout-toggle-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => setLayoutMode('grid')}
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`layout-toggle-btn ${layoutMode === 'list' ? 'active' : ''}`}
              onClick={() => setLayoutMode('list')}
              aria-label="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div className="sort-dropdown-container">
            <span className="sort-label">{t('filters.sortBy')}:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">{t('filters.featured')}</option>
              <option value="lowToHigh">{t('filters.lowToHigh')}</option>
              <option value="highToLow">{t('filters.highToLow')}</option>
              <option value="ratingDesc">{t('filters.ratingDesc')}</option>
            </select>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="no-results">
          <Search size={48} className="no-results-icon" />
          <h3>{t('products.searchNoResults')}</h3>
        </div>
      ) : (
        <div className={`products-grid ${layoutMode === 'list' ? 'list-view' : ''}`}>
          {sortedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = addedItems.includes(product.id);

            return (
              <div key={product.id} className="product-card">
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                
                <button
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} fill={isWishlisted ? 'var(--accent-red)' : 'transparent'} />
                </button>

                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-img" />
                  <button
                    className="product-quick-view"
                    onClick={() => onQuickView(product)}
                  >
                    <Eye size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} />
                    {t('products.quickView')}
                  </button>
                </div>

                <div className="product-info">
                  <span className="product-category">{t(`categories.${product.category}`)}</span>
                  <h4 className="product-title">{product.name}</h4>
                  
                  <div className="product-rating-row">
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(product.rating) ? '#ffb800' : 'transparent'}
                          stroke={i < Math.floor(product.rating) ? '#ffb800' : 'currentColor'}
                        />
                      ))}
                    </div>
                    <span className="rating-count">({product.reviewsCount})</span>
                  </div>

                  <div className="product-price-row">
                    <div className="product-price">
                      {t('products.pricePrefix')}{product.price}
                      {product.originalPrice && (
                        <span className="product-price-original">
                          {t('products.pricePrefix')}{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      className={`add-cart-btn ${isAdded ? 'added' : ''}`}
                      onClick={() => onAddToCart(product.id)}
                      aria-label="Add to cart"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
