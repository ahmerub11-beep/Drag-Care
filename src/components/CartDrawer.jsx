import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStorefront } from './ProductCatalog';
import { resolveImageUrl } from '../api'; 

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    handleUpdateQuantity,
    handleRemoveItem,
    setIsCheckoutOpen,
    formatCurrency,
    t
  } = useStorefront();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 30.00;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 3.50;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'DRAGCARE15' || couponCode.trim().toUpperCase() === 'FIRST10') {
      setDiscountPercent(15);
      setCouponMsg({ text: 'Success! 15% discount applied.', type: 'success' });
    } else {
      setDiscountPercent(0);
      setCouponMsg({ text: 'Invalid coupon code. Try DRAGCARE15', type: 'error' });
    }
  };

  return (
    <>
      <div className="offcanvas-backdrop fade show" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-drawer-panel offcanvas offcanvas-end show d-flex flex-column mw-100" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header offcanvas-header border-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#7A45A9" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1D395F' }}>
              {t('Your Pharmacy Bag')} ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button className="btn-close" onClick={() => setIsCartOpen(false)} aria-label="Close">
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="cart-shipping-meter p-3 border-bottom">
          {remainingForFree > 0 ? (
            <div>
              {t('Add')} <strong>{formatCurrency(remainingForFree)}</strong> {t('more to unlock')} <strong>{t('Free Express Delivery')}</strong>!
            </div>
          ) : (
            <div style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              <span>{t('Congratulations! You qualify for FREE Express Delivery!')}</span>
            </div>
          )}
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: `${progressPercent}%`, background: remainingForFree === 0 ? '#10B981' : '#7A45A9' }}></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-scroll flex-grow-1 overflow-auto p-3">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 14px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1D395F', marginBottom: '6px' }}>
                {t('Your cart is empty')}
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
                {t('Browse our wide selection of verified medicines and healthcare products.')}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                {t('Start Shopping')}
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-row d-flex gap-3 mb-3">
                <img src={resolveImageUrl(item.image)} alt={item.name} className="cart-item-img img-thumbnail flex-shrink-0" width="64" height="64" />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-salt">{item.genericSalt}</div>
                  
                  {item.isRxRequired && (
                    <span style={{ fontSize: '10px', background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Rx Prescription Required
                    </span>
                  )}
                  {item.isColdChain && (
                    <span style={{ fontSize: '10px', background: '#E0F2FE', color: '#0284C7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, marginLeft: '4px' }}>
                      ❄ 2°C - 8°C Cold Chain
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div className="qty-stepper">
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#7A45A9' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        ({formatCurrency(item.price)} {t('each')})
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      style={{ color: '#94A3B8', padding: '4px' }}
                      title="Remove medicine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer border-top p-3">
            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="coupon-input-group input-group mb-3">
              <input className="form-control"
                type="text" 
                placeholder={t('Promo Code (try DRAGCARE15)')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className="btn btn-primary"
                type="submit"
                style={{ background: '#1D395F', color: '#FFF', padding: '0 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
              >
                {t('Apply')}
              </button>
            </form>

            {couponMsg.text && (
              <div style={{ 
                fontSize: '12px', 
                marginBottom: '10px', 
                color: couponMsg.type === 'success' ? '#059669' : '#DC2626',
                fontWeight: 600 
              }}>
                {couponMsg.text}
              </div>
            )}

            <div className="cart-summary-line">
              <span>{t('Subtotal:')}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="cart-summary-line" style={{ color: '#059669', fontWeight: 600 }}>
                <span>{t('Coupon Discount (15%):')}</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>{t('Express Delivery Fee:')}</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: '#059669' }}>{t('FREE')}</strong> : formatCurrency(deliveryFee)}</span>
            </div>

            <div className="cart-summary-line total">
              <span>{t('Estimated Total:')}</span>
              <span style={{ color: '#7A45A9' }}>{formatCurrency(grandTotal)}</span>
            </div>

            <button 
              className="btn-checkout-full btn btn-primary w-100 mt-3"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              <span>{t('Proceed to Checkout')}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11.5px', color: '#64748B' }}>
              🔒 256-Bit SSL Encrypted & DRAP Certified Dispensation
            </div>
          </div>
        )}
      </div>
    </>
  );
}
