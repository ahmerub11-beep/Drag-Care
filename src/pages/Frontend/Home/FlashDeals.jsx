import { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import { useStorefront } from '../../../components/ProductCatalog';

export default function FlashDeals() {
  const { medicines, medicinesLoading, wishlist, handleAddToCart, handleToggleWishlist, handleQuickView, formatCurrency, t } = useStorefront();
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45
  });

  // Ticking countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = medicines.filter(m => m.isFlashDeal).slice(0, 4);

  if (medicinesLoading || dealProducts.length === 0) return null;

  return (
    <div className="container" id="flash-deals">
      <div className="flash-deals-box card border-0 shadow-sm p-3 p-md-4 my-4">
        <div className="flash-deals-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DB4444', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Flame size={16} fill="#DB4444" />
              <span>{t('Limited Time Daily Discounts')}</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1D395F' }}>
              {t('Deals of the Day & Special Offers')}
            </h2>
          </div>

          <div className="countdown-box">
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={15} /> Ends In:
            </span>
            <div className="countdown-chip">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-chip">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-chip" style={{ background: '#DB4444' }}>
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>

        <div className="products-grid row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {dealProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              formatCurrency={formatCurrency}
              t={t}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
