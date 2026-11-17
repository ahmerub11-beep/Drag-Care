import { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';
import { useStorefront } from './ProductCatalog';
import { resolveImageUrl } from '../api';

export default function QuickViewModal() {
  const {
    quickViewProduct: product,
    isQuickViewOpen,
    setIsQuickViewOpen,
    handleAddToCart,
    formatCurrency,
    t
  } = useStorefront();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isQuickViewOpen || !product) return null;

  const handleAdd = () => {
    handleAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50 overflow-auto" role="dialog" aria-modal="true" onClick={() => setIsQuickViewOpen(false)}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content p-3 p-md-4">
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setIsQuickViewOpen(false)} aria-label="Close">
        </button>

        <div className="row g-3 g-md-4">
          {/* Left Column: Image and badges */}
          <div className="col-12 col-md-5">
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #E2E8F0', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={resolveImageUrl(product.image)} 
                alt={product.name} 
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
              {product.isRxRequired && (
                <span className="badge-tag badge-rx">● {t('Rx Required')}</span>
              )}
              {product.isColdChain && (
                <span className="badge-tag badge-cold">❄ {t('Cold Chain (2°C - 8°C)')}</span>
              )}
              <span className="badge-tag" style={{ background: '#F1F5F9', color: '#1D395F' }}>
                {t('Exp:')} {product.expiryDate}
              </span>
            </div>
          </div>

          {/* Right Column: Clinical Details */}
          <div className="col-12 col-md-7">
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#7A45A9', textTransform: 'uppercase', marginBottom: '4px' }}>
              {product.manufacturer}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1D395F', lineHeight: 1.3, marginBottom: '6px' }}>
              {product.name}
            </h2>

            <div style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic', marginBottom: '12px' }}>
            {t('Active Salt / Composition:')} <strong>{product.genericSalt}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'} color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D395F' }}>{product.rating}</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>({product.reviewsCount} verified patient reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#7A45A9' }}>{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '15px', color: '#94A3B8', textDecoration: 'line-through' }}>
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
                {t('In Stock')} ({product.stockCount} {t('units available')})
              </span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>{t('Indications:')}</strong> {product.indications}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>{t('Recommended Dosage:')}</strong> {product.dosage}
              </div>
              <div>
                <strong>{t('Storage:')}</strong> {product.storageCondition}
              </div>
            </div>

            {/* Qty & Add to Cart */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="qty-stepper" style={{ padding: '2px' }}>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Minus size={13} />
                </button>
                <span className="qty-val" style={{ width: '32px' }}>{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  <Plus size={13} />
                </button>
              </div>

              <button 
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', background: isAdded ? '#10B981' : undefined }}
                onClick={handleAdd}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>{t('Added to Cart!')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{t('Add to Bag')} • {formatCurrency(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
