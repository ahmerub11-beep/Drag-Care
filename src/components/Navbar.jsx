import { useState } from 'react';
import { 
  Menu, 
  ChevronDown, 
  Pill, 
  Clock, 
  Stethoscope, 
  Baby, 
  Activity,
  HeartPulse,
  Sparkles,
  Cross
} from 'lucide-react';
import { CATEGORIES } from '../data/medicinesData';
import { useStorefront } from './ProductCatalog';

export default function Navbar() {
  const {
    activeFilter,
    setActiveFilter,
    setIsPrescriptionOpen,
    setIsConsultOpen,
    handleScrollToSection,
    t
  } = useStorefront();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'prescription': return <Pill size={16} color="#7A45A9" />;
      case 'otc': return <Cross size={16} color="#059669" />;
      case 'cold-flu': return <Clock size={16} color="#D97706" />;
      case 'diabetes': return <Activity size={16} color="#2563EB" />;
      case 'heart': return <HeartPulse size={16} color="#DC2626" />;
      case 'supplements': return <Sparkles size={16} color="#9333EA" />;
      case 'devices': return <Stethoscope size={16} color="#0284C7" />;
      case 'baby-mother': return <Baby size={16} color="#EC4899" />;
      default: return <Pill size={16} color="#7A45A9" />;
    }
  };

  return (
    <nav className="nav-bar bg-white border-bottom">
      <div className="container">
        <div className="nav-row d-flex align-items-center justify-content-between flex-wrap">
          {/* Categories Dropdown Trigger */}
          <div className="position-relative">
            <button
              type="button"
              className="category-dropdown-trigger btn btn-primary d-flex align-items-center gap-2 my-2"
              onClick={() => setIsCategoryOpen(open => !open)}
              aria-expanded={isCategoryOpen}
            >
              <Menu size={18} />
              <span>{t('All Categories')}</span>
              <ChevronDown size={16} className="ms-auto" />
            </button>

            {isCategoryOpen && (
              <div className="category-menu-popover position-absolute top-100 start-0 bg-white border rounded shadow w-100 z-3">
                {CATEGORIES.slice(1).map(cat => (
                  <button
                    key={cat.id} 
                    type="button"
                    className="cat-item-link btn btn-light w-100 d-flex align-items-center justify-content-between text-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(cat.id);
                      setIsCategoryOpen(false);
                      handleScrollToSection('catalog-section');
                    }}
                  >
                    <div className="cat-item-left">
                      {getCategoryIcon(cat.id)}
                      <span>{t(cat.name)}</span>
                    </div>
                    <span className="cat-count-pill">{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <button
            type="button"
            className="btn btn-outline-primary d-lg-none my-2"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <Menu size={18} /> Menu
          </button>

          <ul className={`nav-links-list list-unstyled align-items-center gap-3 flex-wrap m-0 py-2 ${isMenuOpen ? 'd-flex flex-column w-100 align-items-start' : 'd-none d-lg-flex'}`}>
            <li className="nav-link-item">
              <a 
                href="#home" 
                className={`nav-link py-1 ${activeFilter === 'all' ? 'text-primary fw-semibold' : 'text-dark'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setActiveFilter('all');
                  handleScrollToSection('home');
                }}
              >
                {t('Home')}
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#catalog"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setActiveFilter('all');
                  handleScrollToSection('catalog-section');
                }}
              >
                {t('Medicines Catalog')}
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#prescription"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setActiveFilter('prescription');
                  handleScrollToSection('catalog-section');
                }}
              >
                {t('Rx Required')}
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#cold-chain"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setActiveFilter('diabetes'); // cold chain insulins
                  handleScrollToSection('catalog-section');
                }}
              >
                {t('Cold-Chain (2-8°C)')}
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#deals"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  handleScrollToSection('flash-deals');
                }}
              >
                {t('Deals & Offers')} <span className="hot-pill">{t('HOT')}</span>
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#presc-upload"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setIsPrescriptionOpen(true);
                }}
              >
                {t('Upload Prescription')}
              </a>
            </li>

            <li className="nav-link-item">
              <a 
                href="#consult"
                className="nav-link py-1 text-dark"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setIsConsultOpen(true);
                }}
              >
                {t('Pharmacist Advice')}
              </a>
            </li>
          </ul>

          {/* Pharmacist Live Duty Badge */}
          <button type="button" className="pharmacist-call-badge btn btn-light d-none d-xl-flex align-items-center gap-2" onClick={() => setIsConsultOpen(true)}>
            <span className="bg-success rounded-circle d-inline-block" style={{ width: '8px', height: '8px' }}></span>
            <span>{t('Pharmacist on Duty')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
