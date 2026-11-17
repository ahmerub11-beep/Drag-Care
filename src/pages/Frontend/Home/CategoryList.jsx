import { 
  Pill, 
  Cross, 
  Activity, 
  HeartPulse, 
  Sparkles, 
  Stethoscope, 
  Baby, 
  ShieldCheck,
  Thermometer
} from 'lucide-react';
import { CATEGORIES } from '../../../data/medicinesData';
import { useStorefront } from '../../../components/ProductCatalog';

export default function CategoryList() {
  const { activeFilter, setActiveFilter, handleScrollToSection, t } = useStorefront();
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'prescription': return <Pill size={26} />;
      case 'otc': return <Cross size={26} />;
      case 'cold-flu': return <Thermometer size={26} />;
      case 'diabetes': return <Activity size={26} />;
      case 'heart': return <HeartPulse size={26} />;
      case 'supplements': return <Sparkles size={26} />;
      case 'devices': return <Stethoscope size={26} />;
      case 'baby-mother': return <Baby size={26} />;
      case 'first-aid': return <ShieldCheck size={26} />;
      default: return <Pill size={26} />;
    }
  };

  return (
    <div className="container" style={{ marginBottom: '40px' }}>
      <div className="section-header d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <div>
          <h2 className="section-title h3 fw-bold">{t('Popular Healthcare Departments')}</h2>
          <p className="section-subtitle text-muted mb-0">{t('Find medicines by therapeutic area and healthcare needs')}</p>
        </div>
      </div>

      <div className="categories-grid row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-6 g-3">
        {CATEGORIES.slice(1).map(cat => (
          <div 
            key={cat.id} 
            className={`category-card col`}
            onClick={() => {
              setActiveFilter(cat.id);
              handleScrollToSection('catalog-section');
            }}
          >
            <div className={`card h-100 p-3 text-center ${activeFilter === cat.id ? 'border-primary' : ''}`}>
              <div className="category-card-icon text-primary mb-2">
                {getCategoryIcon(cat.id)}
              </div>
              <h4 className="category-card-title fs-6 fw-semibold">{t(cat.name)}</h4>
              <span className="category-card-count small text-muted">{cat.count} {t('Medicines')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
