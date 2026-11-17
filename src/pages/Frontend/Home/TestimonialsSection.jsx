import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../../../data/medicinesData';
import { useStorefront } from '../../../components/ProductCatalog';

export default function TestimonialsSection() {
  const { t } = useStorefront();
  return (
    <div className="container" style={{ marginBottom: '48px' }}>
      <div className="section-header d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <div>
          <h2 className="section-title h3 fw-bold">{t('Verified Patient & Doctor Reviews')}</h2>
          <p className="section-subtitle text-muted mb-0">{t('Real experiences from patients managing chronic treatments with Drag Care')}</p>
        </div>
      </div>

      <div className="testimonials-grid row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="col">
            <div className="testimonial-card card h-100 p-3">
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="testimonial-comment">"{t.comment}"</p>
              </div>

              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="author-avatar" />
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
