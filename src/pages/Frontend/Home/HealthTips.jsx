import { Calendar, Clock } from 'lucide-react';
import { HEALTH_ARTICLES } from '../../../data/medicinesData';
import { useStorefront } from '../../../components/ProductCatalog';

export default function HealthTips() {
  const { t } = useStorefront();
  return (
    <div className="container" style={{ marginBottom: '56px' }}>
      <div className="section-header d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <div>
          <h2 className="section-title h3 fw-bold">{t('Pharmacy Insights & Medication Guides')}</h2>
          <p className="section-subtitle text-muted mb-0">{t('Articles written and reviewed by licensed pharmacists')}</p>
        </div>
      </div>

      <div className="articles-grid row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {HEALTH_ARTICLES.map(art => (
          <div key={art.id} className="col">
            <div className="article-card card h-100 overflow-hidden">
              <img src={art.image} alt={art.title} className="article-thumb img-fluid w-100 object-fit-cover" />
              <div className="article-body">
                <span className="article-cat-tag">{art.category}</span>
                <h3 className="article-title">{art.title}</h3>
                <p className="article-excerpt">{art.excerpt}</p>
                
                <div className="article-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} />
                    <span>{art.date}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} />
                    <span>{art.readTime}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
