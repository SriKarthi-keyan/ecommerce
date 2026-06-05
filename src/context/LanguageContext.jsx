import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appName: 'nexacart',
    searchPlaceholder: 'Search products, brands and categories...',
    selectLocation: 'Deliver to',
    defaultLocation: 'Select Location',
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    categories: {
      all: 'All Categories',
      electronics: 'Electronics',
      fashion: 'Fashion',
      home: 'Home & Kitchen',
      sports: 'Sports & Outdoors',
      books: 'Books',
      beauty: 'Beauty & Care'
    },
    filters: {
      title: 'Filters',
      priceRange: 'Price Range',
      rating: 'Customer Rating',
      starsUp: 'Stars & Up',
      clearAll: 'Clear All',
      sortBy: 'Sort By',
      featured: 'Featured',
      lowToHigh: 'Price: Low to High',
      highToLow: 'Price: High to Low',
      ratingDesc: 'Avg. Customer Review'
    },
    products: {
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart!',
      quickView: 'Quick View',
      searchNoResults: 'No products found matching your search.',
      pricePrefix: '$',
      reviews: 'reviews',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      wishlistAdded: 'Added to wishlist!',
      wishlistRemoved: 'Removed from wishlist!'
    },
    footer: {
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Preference',
      contact: 'Contact Support',
      language: 'Language',
      copyright: '© 2026 nexacart. All rights reserved. Made for visual excellence.'
    },
    auth: {
      loginTitle: 'Welcome Back',
      signUpTitle: 'Create Account',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      loginBtn: 'Sign In',
      signUpBtn: 'Register',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      successLogin: 'Simulated login successful!',
      successRegister: 'Simulated registration successful!'
    },
    banner: {
      title1: 'Upgrade Your Lifestyle',
      desc1: 'Discover premium tech, home decor, and fashion with crimson accents.',
      title2: 'Redefining Smart Tech',
      desc2: 'Explore the next level of electronics designed for precision.',
      shopNow: 'Shop Now',
      viewCollection: 'View Collection'
    }
  },
  es: {
    appName: 'nexacart',
    searchPlaceholder: 'Buscar productos, marcas y categorías...',
    selectLocation: 'Entregar a',
    defaultLocation: 'Seleccionar ubicación',
    login: 'Iniciar sesión',
    signUp: 'Registrarse',
    logout: 'Cerrar sesión',
    categories: {
      all: 'Todas las categorías',
      electronics: 'Electrónica',
      fashion: 'Moda',
      home: 'Hogar y Cocina',
      sports: 'Deportes y Aire libre',
      books: 'Libros',
      beauty: 'Belleza y Cuidado'
    },
    filters: {
      title: 'Filtros',
      priceRange: 'Rango de precios',
      rating: 'Calificación del cliente',
      starsUp: 'Estrellas y más',
      clearAll: 'Borrar todo',
      sortBy: 'Ordenar por',
      featured: 'Destacados',
      lowToHigh: 'Precio: de menor a mayor',
      highToLow: 'Precio: de mayor a menor',
      ratingDesc: 'Calificación promedio'
    },
    products: {
      addToCart: 'Añadir al carrito',
      addedToCart: '¡Añadido al carrito!',
      quickView: 'Vista rápida',
      searchNoResults: 'No se encontraron productos para su búsqueda.',
      pricePrefix: '$',
      reviews: 'reseñas',
      inStock: 'En stock',
      outOfStock: 'Agotado',
      wishlistAdded: '¡Añadido a la lista de deseos!',
      wishlistRemoved: '¡Eliminado de la lista de deseos!'
    },
    footer: {
      terms: 'Términos y condiciones',
      privacy: 'Política de privacidad',
      cookies: 'Preferencia de cookies',
      contact: 'Soporte técnico',
      language: 'Idioma',
      copyright: '© 2026 nexacart. Todos los derechos reservados. Diseñado para la excelencia visual.'
    },
    auth: {
      loginTitle: 'Bienvenido de nuevo',
      signUpTitle: 'Crear cuenta',
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      nameLabel: 'Nombre completo',
      loginBtn: 'Iniciar sesión',
      signUpBtn: 'Registrarse',
      noAccount: '¿No tienes una cuenta?',
      hasAccount: '¿Ya tienes una cuenta?',
      successLogin: '¡Inicio de sesión simulado con éxito!',
      successRegister: '¡Registro simulado con éxito!'
    },
    banner: {
      title1: 'Mejora tu estilo de vida',
      desc1: 'Descubre tecnología premium, decoración del hogar y moda con detalles en carmesí.',
      title2: 'Redefiniendo la tecnología inteligente',
      desc2: 'Explore el siguiente nivel de electrónica diseñada para la precisión.',
      shopNow: 'Comprar ahora',
      viewCollection: 'Ver colección'
    }
  },
  hi: {
    appName: 'nexacart',
    searchPlaceholder: 'उत्पाद, ब्रांड और श्रेणियां खोजें...',
    selectLocation: 'डिलिवरी करें',
    defaultLocation: 'स्थान चुनें',
    login: 'लॉगिन',
    signUp: 'साइन अप',
    logout: 'लॉगआउट',
    categories: {
      all: 'सभी श्रेणियां',
      electronics: 'इलेक्ट्रॉनिक्स',
      fashion: 'फैशन',
      home: 'घर और रसोई',
      sports: 'खेल और आउटडोर',
      books: 'पुस्तकें',
      beauty: 'सौंदर्य और देखभाल'
    },
    filters: {
      title: 'फ़िल्टर',
      priceRange: 'मूल्य सीमा',
      rating: 'ग्राहक रेटिंग',
      starsUp: 'सितारे और अधिक',
      clearAll: 'सभी साफ करें',
      sortBy: 'क्रमबद्ध करें',
      featured: 'विशेष रुप से प्रदर्शित',
      lowToHigh: 'मूल्य: कम से उच्च',
      highToLow: 'मूल्य: उच्च से कम',
      ratingDesc: 'औसत ग्राहक समीक्षा'
    },
    products: {
      addToCart: 'कार्ट में जोड़ें',
      addedToCart: 'कार्ट में जोड़ा गया!',
      quickView: 'त्वरित झलक',
      searchNoResults: 'आपकी खोज से मेल खाने वाले कोई उत्पाद नहीं मिले।',
      pricePrefix: '₹',
      reviews: 'समीक्षाएं',
      inStock: 'स्टॉक में है',
      outOfStock: 'स्टॉक से बाहर',
      wishlistAdded: 'इच्छा सूची में जोड़ा गया!',
      wishlistRemoved: 'इच्छा सूची से हटाया गया!'
    },
    footer: {
      terms: 'नियम और शर्तें',
      privacy: 'गोपनीयता नीति',
      cookies: 'कुकी प्राथमिकताएं',
      contact: 'ग्राहक सहायता',
      language: 'भाषा',
      copyright: '© 2026 nexacart. सर्वाधिकार सुरक्षित। दृश्य उत्कृष्टता के लिए निर्मित।'
    },
    auth: {
      loginTitle: 'स्वागत है',
      signUpTitle: 'खाता बनाएं',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      nameLabel: 'पूरा नाम',
      loginBtn: 'साइन इन करें',
      signUpBtn: 'रजिस्टर करें',
      noAccount: 'क्या आपके पास खाता नहीं है?',
      hasAccount: 'पहले से ही एक खाता है?',
      successLogin: 'सिम्युलेटेड लॉगिन सफल रहा!',
      successRegister: 'सिम्युलेटेड पंजीकरण सफल रहा!'
    },
    banner: {
      title1: 'अपनी जीवनशैली को अपग्रेड करें',
      desc1: 'क्रिमसन लहजे के साथ प्रीमियम तकनीक, गृह सज्जा और फैशन की खोज करें।',
      title2: 'स्मार्ट टेक को फिर से परिभाषित करना',
      desc2: 'सटीकता के लिए डिज़ाइन किए गए इलेक्ट्रॉनिक्स के अगले स्तर का अन्वेषण करें।',
      shopNow: 'अभी खरीदें',
      viewCollection: 'संग्रह देखें'
    }
  },
  fr: {
    appName: 'nexacart',
    searchPlaceholder: 'Rechercher des produits, des marques et des catégories...',
    selectLocation: 'Livrer à',
    defaultLocation: 'Choisir l\'emplacement',
    login: 'Connexion',
    signUp: 'S\'inscrire',
    logout: 'Déconnexion',
    categories: {
      all: 'Toutes catégories',
      electronics: 'Électronique',
      fashion: 'Mode',
      home: 'Maison et Cuisine',
      sports: 'Sports et Loisirs',
      books: 'Livres',
      beauty: 'Beauté et Soins'
    },
    filters: {
      title: 'Filtres',
      priceRange: 'Gamme de prix',
      rating: 'Avis clients',
      starsUp: 'Étoiles et plus',
      clearAll: 'Effacer tout',
      sortBy: 'Trier par',
      featured: 'Vedettes',
      lowToHigh: 'Prix : croissant',
      highToLow: 'Prix : décroissant',
      ratingDesc: 'Moyenne des avis clients'
    },
    products: {
      addToCart: 'Ajouter au panier',
      addedToCart: 'Ajouté au panier !',
      quickView: 'Aperçu rapide',
      searchNoResults: 'Aucun produit trouvé pour votre recherche.',
      pricePrefix: '€',
      reviews: 'avis',
      inStock: 'En stock',
      outOfStock: 'Rupture de stock',
      wishlistAdded: 'Ajouté à la liste d\'envies !',
      wishlistRemoved: 'Retiré de la liste d\'envies !'
    },
    footer: {
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      cookies: 'Préférences de cookies',
      contact: 'Support technique',
      language: 'Langue',
      copyright: '© 2026 nexacart. Tous droits réservés. Conçu pour l\'excellence visuelle.'
    },
    auth: {
      loginTitle: 'De retour parmi nous',
      signUpTitle: 'Créer un compte',
      emailLabel: 'Adresse e-mail',
      passwordLabel: 'Mot de passe',
      nameLabel: 'Nom complet',
      loginBtn: 'Se connecter',
      signUpBtn: 'S\'enregistrer',
      noAccount: 'Vous n\'avez pas de compte ?',
      hasAccount: 'Vous avez déjà un compte ?',
      successLogin: 'Connexion simulée réussie !',
      successRegister: 'Inscription simulée réussie !'
    },
    banner: {
      title1: 'Améliorez votre style de vie',
      desc1: 'Découvrez de la technologie haut de gamme, de la décoration intérieure et de la mode aux accents cramoisis.',
      title2: 'Redéfinir la technologie intelligente',
      desc2: 'Explorez le niveau supérieur d\'électronique conçu pour la précision.',
      shopNow: 'Acheter maintenant',
      viewCollection: 'Voir la collection'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        return keyPath; // fallback
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
