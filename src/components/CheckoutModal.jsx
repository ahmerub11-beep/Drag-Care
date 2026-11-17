import { useState } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  AlertTriangle 
} from 'lucide-react';
import { apiFetch } from '../api';
import { useStorefront } from './ProductCatalog';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    handleClearCart,
    formatCurrency,
    t
  } = useStorefront();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: '',
    deliverySpeed: '',
    notes: ''
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = formData.deliverySpeed === 'express' ? 2.50 : 0.00;
  const total = subtotal + deliveryFee;

  const hasRxItem = cartItems.some(item => item.isRxRequired);
  const hasColdChain = cartItems.some(item => item.isColdChain);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isRxRequired: item.isRxRequired,
          isColdChain: item.isColdChain
        })),
        customer: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes
        },
        deliverySpeed: formData.deliverySpeed,
        paymentMethod: formData.paymentMethod,
        total
      };

      const response = await apiFetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to place order');
      }

      const newId = data.order?.id || 'DRAG-ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newId);
      setOrderConfirmed(true);
      handleClearCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFinish = () => {
    setOrderConfirmed(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50 overflow-auto" role="dialog" aria-modal="true" onClick={handleFinish}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content p-3 p-md-4">
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={handleFinish} aria-label="Close">
        </button>

        {orderConfirmed ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1D395F', marginBottom: '8px' }}>
              {t('Order Placed Successfully!')}
            </h2>

            <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', padding: '12px 20px', borderRadius: '10px', display: 'inline-block', margin: '14px 0' }}>
              {t('Order Tracking ID:')} <strong style={{ color: '#7A45A9' }}>{orderId}</strong>
            </div>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
              {t('Thank you,')} <strong>{formData.name}</strong>. {t('Your pharmacy order of')} <strong>{formatCurrency(total)}</strong> {t('has been received by our central dispensary. Our dispatch rider will deliver to')} <strong>{formData.address}, {formData.city}</strong>.
            </p>

            {hasColdChain && (
              <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '10px 16px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '24px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} />
                <span><strong>Cold-Chain Protection Activated:</strong> Your temperature-sensitive medicines are packed with dry ice gel packs maintaining 2°C - 8°C.</span>
              </div>
            )}

            <button 
              className="btn btn-primary w-100"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleFinish}
            >
              {t('Continue Shopping')}
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1D395F', marginBottom: '6px' }}>
              {t('Checkout & Delivery Details')}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              {t('Complete your patient delivery information for express pharmaceutical dispatch.')}
            </p>

            {hasRxItem && (
              <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#9F1239' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>{t('Rx Alert:')}</strong> {t("Your order contains prescription-only medication. Our registered pharmacist may call you or verify your doctor's slip before dispatch.")}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('Full Name*')}
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('WhatsApp / Phone*')}
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-4">
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('City*')}
                  </label>
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-select"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                <div className="col-12 col-sm-8">
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('Delivery Address*')}
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Delivery Speed */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '6px' }}>
                  {t('Delivery Speed')}
                </label>
                <div className="row g-2">
                  <label 
                    className="col-12 col-sm-6"
                    style={{ 
                      border: formData.deliverySpeed === 'express' ? '2px solid #7A45A9' : '1px solid #CBD5E1',
                      background: formData.deliverySpeed === 'express' ? '#FAF5FF' : '#FFF',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="deliverySpeed"
                      checked={formData.deliverySpeed === 'express'}
                      onChange={() => setFormData({ ...formData, deliverySpeed: 'express' })}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1D395F' }}>⚡ {t('2-Hour Express')}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>+{formatCurrency(2.5)} ({t('Cold-chain')})</div>
                    </div>
                  </label>

                  <label 
                    className="col-12 col-sm-6"
                    style={{ 
                      border: formData.deliverySpeed === 'standard' ? '2px solid #7A45A9' : '1px solid #CBD5E1',
                      background: formData.deliverySpeed === 'standard' ? '#FAF5FF' : '#FFF',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="deliverySpeed"
                      checked={formData.deliverySpeed === 'standard'}
                      onChange={() => setFormData({ ...formData, deliverySpeed: 'standard' })}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1D395F' }}>{t('Standard (Same-Day)')}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{t('Free Delivery')}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '6px' }}>
                  {t('Payment Method')}
                </label>
                <div className="row row-cols-1 row-cols-sm-3 g-2">
                  <label 
                    className="col"
                    style={{ 
                      border: formData.paymentMethod === 'cod' ? '2px solid #7A45A9' : '1px solid #CBD5E1',
                      background: formData.paymentMethod === 'cod' ? '#FAF5FF' : '#FFF',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '12.5px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      style={{ display: 'none' }}
                    />
                    <Banknote size={20} color="#7A45A9" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 700, color: '#1D395F' }}>{t('Cash on Delivery')}</div>
                  </label>

                  <label 
                    className="col"
                    style={{ 
                      border: formData.paymentMethod === 'card' ? '2px solid #7A45A9' : '1px solid #CBD5E1',
                      background: formData.paymentMethod === 'card' ? '#FAF5FF' : '#FFF',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '12.5px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      style={{ display: 'none' }}
                    />
                    <CreditCard size={20} color="#7A45A9" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 700, color: '#1D395F' }}>Credit / Debit</div>
                  </label>

                  <label 
                    className="col"
                    style={{ 
                      border: formData.paymentMethod === 'mobile' ? '2px solid #7A45A9' : '1px solid #CBD5E1',
                      background: formData.paymentMethod === 'mobile' ? '#FAF5FF' : '#FFF',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '12.5px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'mobile' })}
                      style={{ display: 'none' }}
                    />
                    <Smartphone size={20} color="#7A45A9" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 700, color: '#1D395F' }}>JazzCash / Easy</div>
                  </label>
                </div>
              </div>

              {/* Total & Action */}
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Total Payable Amount:</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#7A45A9' }}>{formatCurrency(total)}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  ✓ Genuine Medicines Guaranteed
                </div>
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-100"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Confirm & Place Pharmacy Order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
