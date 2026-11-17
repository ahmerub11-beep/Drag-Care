import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStorefront } from './ProductCatalog';
import { resolveImageUrl } from '../api';
import { 
  Pill, 
  Search, 
  ShoppingBag, 
  Heart, 
  PhoneCall, 
  Percent, 
  X,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { CATEGORIES } from '../data/medicinesData';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const {
    medicines,
    cartItems,
    wishlist,
    currency,
    setCurrency,
    language,
    setLanguage,
    formatCurrency,
    t,
    setIsCartOpen,
    setIsConsultOpen,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    handleQuickView
  } = useStorefront();
  const [isCopied, setIsCopied] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const searchSource = medicines;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const searchResults = normalizedQuery === '' ? [] : searchSource.filter(med => {
    const matchesQuery = med.name.toLocaleLowerCase().includes(normalizedQuery) ||
                         med.genericSalt.toLocaleLowerCase().includes(normalizedQuery) ||
                         med.manufacturer.toLocaleLowerCase().includes(normalizedQuery);
    const matchesCat = activeFilter === 'all' || med.category === activeFilter;
    return matchesQuery && matchesCat;
  }).slice(0, 5);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setIsSearchOpen(false);
    navigate('/medicines');
  };

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText('DRAGCARE15');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {user && (
        <div className="bg-dark text-white py-2 px-3 small d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-primary">Logged in as {user.name}</span>
            <span className="badge bg-secondary text-uppercase">{user.role}</span>
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {isAdmin && (
              <Link to="/dashboard" className="text-warning fw-bold text-decoration-none d-flex align-items-center gap-1">
                <LayoutDashboard size={14} /> Go to Admin Dashboard →
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="btn btn-outline-light btn-sm py-0 px-2 small"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="topbar bg-primary text-white py-2">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="topbar-left d-none d-lg-flex align-items-center">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Percent size={14} color="#FFD272" />
              <span>Enjoy <strong>15% Off</strong> Your First Order! Code:</span>
              <button 
                onClick={copyCoupon}
                className="topbar-badge" 
                title="Click to copy coupon"
                style={{ cursor: 'pointer' }}
              >
                {isCopied ? 'COPIED! ✓' : 'DRAGCARE15'}
              </button>
            </span>
          </div>

          <div className="topbar-right d-flex align-items-center justify-content-end flex-wrap gap-2">
            <span className="d-none d-lg-flex" style={{ alignItems: 'center', gap: '6px' }}>
              <PhoneCall size={13} />
              <span>24/7 Pharmacist Helpline: <strong>+92 (800) 3724-CARE</strong></span>
            </span>
            <span className="d-none d-lg-inline" style={{ opacity: 0.4 }}>|</span>
            <select 
              aria-label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              title="Prices are converted for display using approximate fixed rates"
              style={{ background: 'transparent', color: '#FFF', border: 'none', fontSize: '12px', cursor: 'pointer' }}
            >
              <option value="USD" style={{ color: '#000' }}>$ USD (US)</option>
              <option value="PKR" style={{ color: '#000' }}>Rs PKR (PK)</option>
              <option value="GBP" style={{ color: '#000' }}>£ GBP (UK)</option>
            </select>
            <select 
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', color: '#FFF', border: 'none', fontSize: '12px', cursor: 'pointer' }}
            >
              <option value="English" style={{ color: '#000' }}>English</option>
              <option value="Urdu" style={{ color: '#000' }}>اردو (Urdu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header bg-white border-bottom sticky-top py-2">
        <div className="container">
          <div className="header-row d-flex flex-column flex-xl-row align-items-stretch align-items-xl-center gap-3">
            {/* Logo */}
            <a href="/" className="brand-logo d-flex align-items-center gap-2 text-decoration-none">
              <div className="brand-icon-wrapper d-flex align-items-center justify-content-center rounded-3 bg-primary text-white p-2">
                <Pill size={26} strokeWidth={2.2} />
              </div>
              <div className="brand-text d-flex flex-column">
                <span className="brand-name fs-4 fw-bold text-dark">Drag<span className="text-primary">Care</span></span>
                <span className="brand-tagline small text-muted">Online Pharmacy & Health</span>
              </div>
            </a>

            {/* Live Search Bar */}
            <div className="search-container position-relative flex-grow-1 w-100" ref={searchRef}>
              <form className="search-box d-flex align-items-center border rounded-pill overflow-hidden bg-white" role="search" onSubmit={handleSearchSubmit}>
                <select 
                  className="search-cat-select form-select border-0 rounded-0"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  aria-label={t('Search category')}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{t(cat.name)}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  className="search-input form-control border-0 rounded-0"
                  placeholder={t('Search medicines...')}
                  value={searchQuery}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isSearchOpen && searchQuery.trim() !== ''}
                  aria-controls="medicine-search-results"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                />

                {searchQuery && (
                  <button 
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    style={{ padding: '0 8px', color: '#94A3B8' }}
                    aria-label={t('Clear search')}
                  >
                    <X size={16} />
                  </button>
                )}

                <button type="submit" className="search-btn btn btn-primary rounded-0 d-flex align-items-center gap-1">
                  <Search size={16} />
                  <span>{t('Search')}</span>
                </button>
              </form>

              {/* Instant Search Results Dropdown */}
              {isSearchOpen && normalizedQuery !== '' && (
                <div id="medicine-search-results" className="search-results-dropdown position-absolute start-0 end-0 bg-white border rounded shadow overflow-auto z-3" role="listbox">
                  <div style={{ padding: '8px 16px', background: '#F8FAFC', fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    {t('Matching Medicines')} ({searchResults.length})
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="search-result-empty">{t('No medicines found matching your criteria')}</div>
                  ) : searchResults.map(med => (
                    <button
                      key={med.id} 
                      type="button"
                      className="search-result-item btn btn-light w-100 d-flex align-items-center gap-3 text-start"
                      role="option"
                      onClick={() => {
                        handleQuickView(med);
                        setIsSearchOpen(false);
                      }}
                    >
                      <img src={resolveImageUrl(med.image)} alt={med.name} className="search-result-thumb" />
                      <div className="search-result-info">
                        <div className="search-result-title">{med.name}</div>
                        <div className="search-result-salt">{med.genericSalt}</div>
                        <div style={{ fontSize: '11px', color: med.isRxRequired ? '#E11D48' : '#059669', fontWeight: 600 }}>
                          {med.isRxRequired ? `• ${t('Rx Required')}` : `• ${t('OTC Available')}`}
                        </div>
                      </div>
                      <div className="search-result-price">{formatCurrency(med.price)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="header-actions d-flex align-items-center justify-content-between justify-content-xl-end flex-wrap gap-2">
              <button 
                className="action-icon-btn btn btn-light btn-sm position-relative d-flex align-items-center gap-2"
                onClick={() => setIsConsultOpen(true)}
                title="Ask a Pharmacist"
              >
                <PhoneCall size={20} />
                <span className="d-none d-lg-inline">{t('Consult')}</span>
              </button>

              <button 
                className="action-icon-btn btn btn-light btn-sm position-relative d-flex align-items-center gap-2"
                title="Wishlist"
                onClick={() => {}}
              >
                <Heart size={21} />
                {wishlist.length > 0 && (
                  <span className="icon-badge">{wishlist.length}</span>
                )}
              </button>

              <button 
                className="action-icon-btn btn btn-light btn-sm position-relative d-flex align-items-center gap-2"
                onClick={() => setIsCartOpen(true)}
                style={{ background: '#FAF5FF', border: '1px solid #E9D5FF' }}
                title="View Shopping Cart"
              >
                <ShoppingBag size={21} color="#7A45A9" />
                {cartCount > 0 && (
                  <span className="icon-badge">{cartCount}</span>
                )}
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>{t('Cart')}</div>
                  <div className="cart-total-badge">{formatCurrency(cartSubtotal)}</div>
                </div>
              </button>

              {/* Account / Dashboard Action */}
              {user ? (
                isAdmin ? (
                  <Link
                    to="/dashboard"
                    className="action-icon-btn btn btn-primary btn-sm d-flex align-items-center gap-2"
                    title="Open admin dashboard"
                    aria-label="Open admin dashboard"
                  >
                    <LayoutDashboard size={20} />
                    <span>{t('Dashboard')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="action-icon-btn btn btn-light btn-sm d-flex align-items-center gap-2"
                    style={{ background: '#F1F5F9' }}
                    title="Store home"
                  >
                    <User size={20} color="#1D395F" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                )
              ) : (
                <Link 
                  to="/auth/login"
                  className="btn btn-outline-primary btn-sm rounded-pill fw-semibold px-3 py-2 d-flex align-items-center gap-1"
                  style={{ textDecoration: 'none' }}
                >
                  <User size={16} />
                  <span>{t('Login / Register')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}