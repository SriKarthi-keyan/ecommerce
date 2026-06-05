// Mock database of products
export const PRODUCTS = [
  {
    id: 'prod_01',
    name: 'Nova Wireless ANC Headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
    category: 'Electronics',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.5,
    reviewsCount: 128,
    tag: 'Sale',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_02',
    name: 'Aero Mechanical Keyboard',
    description: 'Compact 75% layout with hot-swappable switches and custom RGB backlighting.',
    category: 'Electronics',
    price: 129.99,
    rating: 4.8,
    reviewsCount: 95,
    tag: 'Featured',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_03',
    name: 'Titan Pro Ergonomic Gaming Mouse',
    description: 'Ultra-lightweight gaming mouse with 26k DPI optical sensor and lag-free wireless.',
    category: 'Electronics',
    price: 79.99,
    rating: 4.7,
    reviewsCount: 140,
    tag: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_04',
    name: 'Classic Leather Bomber Jacket',
    description: 'Genuine leather jacket featuring a classic fit, rib-knit trims, and multiple pockets.',
    category: 'Fashion',
    price: 189.50,
    originalPrice: 220.00,
    rating: 4.3,
    reviewsCount: 64,
    tag: 'Sale',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_05',
    name: 'Eco-Friendly Running Sneakers',
    description: 'Lightweight, breathable sneakers made entirely from recycled ocean plastics.',
    category: 'Fashion',
    price: 95.00,
    rating: 4.6,
    reviewsCount: 210,
    tag: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_06',
    name: 'Minimalist Ceramic Coffee Dripper',
    description: 'Handcrafted ceramic pour-over dripper designed for optimal heat retention and clean flavor.',
    category: 'Home & Kitchen',
    price: 34.99,
    rating: 4.9,
    reviewsCount: 42,
    tag: 'Featured',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_07',
    name: 'Stainless Steel Insulated Flask',
    description: 'Double-wall vacuum flask that keeps drinks hot for 12 hours or cold for 24 hours.',
    category: 'Home & Kitchen',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.4,
    reviewsCount: 312,
    tag: 'Sale',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_08',
    name: 'Smart Water Bottle with Hydration Tracker',
    description: 'Rechargeable bottle that syncs via Bluetooth to track your daily water consumption.',
    category: 'Sports & Outdoors',
    price: 59.99,
    rating: 4.2,
    reviewsCount: 88,
    tag: '',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_09',
    name: 'Advanced Yoga Block & Strap Set',
    description: 'Premium high-density foam blocks paired with an extra-long cotton yoga strap.',
    category: 'Sports & Outdoors',
    price: 19.99,
    rating: 4.7,
    reviewsCount: 154,
    tag: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_10',
    name: 'The Art of Sustainable Living (Hardcover)',
    description: 'An insightful guide filled with practical tips and strategies for reducing your ecological footprint.',
    category: 'Books',
    price: 27.99,
    rating: 4.8,
    reviewsCount: 57,
    tag: 'Featured',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod_11',
    name: 'Organic Hydrating Face Serum',
    description: 'Infused with hyaluronic acid and rosewater to naturally brighten and hydrate skin.',
    category: 'Beauty & Care',
    price: 45.00,
    originalPrice: 55.00,
    rating: 4.5,
    reviewsCount: 176,
    tag: 'Sale',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60'
  }
];

/**
 * Get all products with search, filter, and sort options
 * @route GET /api/products
 * @access Public
 */
export const getProducts = (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      minRating, 
      sortBy 
    } = req.query;

    let filteredProducts = [...PRODUCTS];

    // 1. Search Query Filter (Checks name and description)
    if (search) {
      const query = search.toString().toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (category) {
      // Allow single category or array of categories (if passed multiple times in query string)
      const categories = Array.isArray(category) 
        ? category.map(c => c.toString().toLowerCase().trim())
        : [category.toString().toLowerCase().trim()];

      filteredProducts = filteredProducts.filter(product => 
        categories.includes(product.category.toLowerCase())
      );
    }

    // 3. Price Range Filter
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }
    }

    // 4. Customer Rating Filter
    if (minRating) {
      const minR = parseFloat(minRating);
      if (!isNaN(minR)) {
        filteredProducts = filteredProducts.filter(product => product.rating >= minR);
      }
    }

    // 5. Sorting
    if (sortBy) {
      const sortOption = sortBy.toString().toLowerCase().trim();
      switch (sortOption) {
        case 'pricelowhigh':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'pricehighlow':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          // Keep default/featured sorting (as defined in PRODUCTS array)
          break;
      }
    }

    // 6. Return response
    return res.status(200).json({
      status: 'success',
      results: filteredProducts.length,
      data: {
        products: filteredProducts
      }
    });

  } catch (error) {
    next(error);
  }
};
