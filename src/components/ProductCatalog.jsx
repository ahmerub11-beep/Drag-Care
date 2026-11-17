import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/medicinesData';
import { ArrowUpDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  formatCurrency,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  translate
} from '../utils/storefrontLocale';

const StorefrontContext = createContext(null);

function getStoredPreference(key, supportedValues, fallback) {
  const savedValue = localStorage.getItem(key);
  return supportedValues.includes(savedValue) ? savedValue : fallback;
}

export function StorefrontProvider({ children }) {
  const [currency, setCurrency] = useState(() => getStoredPreference('dragcare_currency', SUPPORTED_CURRENCIES, 'USD'));
  const [language, setLanguage] = useState(() => getStoredPreference('dragcare_language', SUPPORTED_LANGUAGES, 'English'));
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dragcare_currency', currency);
  }, [currency]);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    const previousDirection = document.documentElement.dir;
    localStorage.setItem('dragcare_language', language);
    document.documentElement.lang = language === 'Urdu' ? 'ur' : 'en';
    document.documentElement.dir = language === 'Urdu' ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.lang = previousLanguage;
      document.documentElement.dir = previousDirection;
    };
  }, [language]);

  useEffect(() => {
    apiFetch('/medicines')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load medicines.');
        if (!Array.isArray(data)) throw new Error('The medicines API returned an invalid response.');
        setMedicines(data);
      })
      .catch((error) => {
        setMedicinesError(error.message || 'Unable to load medicines.');
      })
      .finally(() => setMedicinesLoading(false));
  }, []);

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item);
      }

      return [...current, {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        genericSalt: product.genericSalt,
        image: product.image,
        isRxRequired: product.isRxRequired,
        isColdChain: product.isColdChain,
        quantity
      }];
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (id) => {
    setWishlist((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const value = {
    currency,
    setCurrency,
    language,
    setLanguage,
    formatCurrency: (amount) => formatCurrency(amount, currency, language),
    t: (text) => translate(text, language),
    medicines,
    medicinesLoading,
    medicinesError,
    cartItems,
    wishlist,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isCartOpen,
    setIsCartOpen,
    isPrescriptionOpen,
    setIsPrescriptionOpen,
    isQuickViewOpen,
    setIsQuickViewOpen,
    quickViewProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isConsultOpen,
    setIsConsultOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart: () => setCartItems([]),
    handleToggleWishlist,
    handleQuickView,
    handleScrollToSection
  };

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

// Shared by storefront sections so they use the same catalog and cart state.
// eslint-disable-next-line react-refresh/only-export-components
export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}

export default function ProductCatalog({ title = 'Verified Medicines & Health Store' }) {
  const {
    medicines,
    medicinesLoading,
    medicinesError,
    formatCurrency: showPrice,
    t,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    wishlist,
    handleAddToCart,
    handleToggleWishlist,
    handleQuickView
  } = useStorefront();
  const { pathname } = useLocation();
  const [sortBy, setSortBy] = useState('featured');

  const productSource = medicines;

  // Filter products by category and active query
  let filtered = productSource.filter(med => {
    const matchesCategory = activeFilter === 'all' ||
      med.category === activeFilter ||
      (activeFilter === 'prescription' && med.isRxRequired);
    const matchesQuery = searchQuery === '' || 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericSalt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    filtered = [...filtered].sort((a, b) => b.discountPercent - a.discountPercent);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <section className="container" id="catalog-section" style={{ marginBottom: '48px' }}>
      <div className="section-header d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h2 className="section-title h3 fw-bold">{t(title)}</h2>
          <p className="section-subtitle text-muted mb-0">
            {t('All pharmaceuticals are stored under DRAP licensed conditions and inspected by certified pharmacists')}
          </p>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <ArrowUpDown size={15} color="#64748B" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select form-select-sm w-auto"
            >
              <option value="featured">{t('Featured / Best Match')}</option>
              <option value="price-low">{t('Price: Low to High')}</option>
              <option value="price-high">{t('Price: High to Low')}</option>
              <option value="discount">{t('Highest Discount')}</option>
              <option value="rating">{t('Top Rated')}</option>
            </select>
          </div>
          <Link
            to={pathname === '/medicines' ? '/' : '/medicines'}
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-outline-primary btn-sm text-nowrap"
          >
            {t(pathname === '/medicines' ? 'Back to Home' : 'See All')}
          </Link>
        </div>
      </div>

      {/* Catalog Filter Tabs */}
      <div className="catalog-tabs nav nav-pills gap-2 mb-3 flex-nowrap overflow-auto">
        <button 
          className={`catalog-tab-btn btn btn-sm text-nowrap ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('all')}
        >
          {t('All Medicines')} ({productSource.length})
        </button>

        {CATEGORIES.slice(1).map(cat => (
          <button 
            key={cat.id}
            className={`catalog-tab-btn btn btn-sm text-nowrap ${activeFilter === cat.id ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {t(cat.name)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {medicinesLoading ? (
        <div className="text-center p-5 bg-white rounded border" role="status">
          <div className="spinner-border text-primary" aria-hidden="true" />
          <div className="text-muted mt-2">{t('Loading medicines...')}</div>
        </div>
      ) : medicinesError ? (
        <div className="alert alert-danger" role="alert">{medicinesError}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-4 p-md-5 bg-white rounded border">
          <div className="fs-5 fw-bold mb-2">
            {productSource.length === 0
              ? t('No medicines have been added yet.')
              : t('No medicines found matching your criteria')}
          </div>
          {productSource.length > 0 && <p className="text-muted mb-3">
            {t("Try clearing filters or search query, or upload your doctor's prescription for manual processing.")}
          </p>}
          {productSource.length > 0 && <button 
            className="btn btn-primary"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
          >
            {t('Reset Filters')}
          </button>}
        </div>
      ) : (
        <div className="products-grid row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              formatCurrency={showPrice}
              t={t}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
}
