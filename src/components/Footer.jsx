import { useState } from 'react';
import { Pill, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useStorefront } from './ProductCatalog';

export default function Footer() {
  const { handleScrollToSection, setIsPrescriptionOpen, t } = useStorefront();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer-wrapper bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="footer-top-grid row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
          {/* Col 1: Brand & Contact */}
          <div className="footer-col col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#7A45A9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Pill size={22} />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFF' }}>
                Drag<span style={{ color: '#C084FC' }}>Care</span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '20px', color: '#CBD5E1' }}>
              Drag Care is an accredited digital healthcare and pharmaceutical dispensary licensed by the Drug Regulatory Authority (DRAP Lic # PB-49102). We deliver genuine medications with guaranteed cold-chain assurance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0' }}>
                <PhoneCall size={16} color="#C084FC" />
                <span>+92 (800) 3724-CARE (24/7 Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0' }}>
                <Mail size={16} color="#C084FC" />
                <span>care@dragcare.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0' }}>
                <MapPin size={16} color="#C084FC" />
                <span>Main Commercial Boulevard, Medical City, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="footer-col col">
            <h4>{t('Quick Categories')}</h4>
            <ul className="footer-links-list list-unstyled d-grid gap-2">
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('Prescription Drugs (Rx)')}</a></li>
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('OTC & Pain Relief')}</a></li>
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('Insulin & Cold-Chain')}</a></li>
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('Diabetes & BP Devices')}</a></li>
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('Vitamins & Supplements')}</a></li>
              <li><a href="#catalog" onClick={() => handleScrollToSection('catalog-section')}>{t('First Aid & Surgical')}</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col col">
            <h4>{t('Patient Services')}</h4>
            <ul className="footer-links-list list-unstyled d-grid gap-2">
              <li><a href="#presc" onClick={(e) => { e.preventDefault(); setIsPrescriptionOpen(true); }}>{t('Order via Prescription')}</a></li>
              <li><a href="#deals" onClick={() => handleScrollToSection('flash-deals')}>{t('Daily Discounts')}</a></li>
              <li><a href="#cold">{t('Cold-Chain Temperature Policy')}</a></li>
              <li><a href="#refill">{t('Monthly Chronic Refill Plan')}</a></li>
              <li><a href="#license">{t('DRAP License Verification')}</a></li>
              <li><a href="#faqs">{t('Pharmacy FAQs & Support')}</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Verification */}
          <div className="footer-col col">
            <h4>{t('Health Newsletter')}</h4>
            <p style={{ fontSize: '13px', color: '#CBD5E1', marginBottom: '14px' }}>
              {t('Subscribe to get seasonal medication reminders, wellness tips, and exclusive coupon codes directly to your inbox.')}
            </p>

            <form onSubmit={handleSubscribe} className="footer-newsletter-box">
              <input 
                type="email" 
                placeholder={t('Enter your email address...')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                {isSubscribed ? `${t('Subscribed!')} ✓` : t('Subscribe')}
              </button>
            </form>

            <div style={{ marginTop: '22px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF', marginBottom: '8px' }}>
                {t('Accreditations & Compliance:')}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="safety-badge">✓ {t('DRAP Registered')}</span>
                <span className="safety-badge">✓ {t('100% Genuine')}</span>
                <span className="safety-badge">✓ {t('Cold-Chain 2-8°C')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div style={{ padding: '20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.6 }}>
          <strong>{t('Medical Disclaimer:')}</strong> {t('The product information provided on Drag Care is for informational and educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Prescription medications (Rx) will strictly only be dispensed upon verification of a valid prescription issued by a registered medical practitioner.')}
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 py-3">
          <div>
            © {new Date().getFullYear()} <strong>Drag Care Online Pharmacy</strong>. All Rights Reserved. Built with clinical excellence.
          </div>

          <div className="footer-badges d-flex flex-wrap align-items-center gap-2">
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{t('Payment Methods:')}</span>
            <span className="safety-badge">{t('Cash on Delivery')}</span>
            <span className="safety-badge">Visa / Mastercard</span>
            <span className="safety-badge">JazzCash / EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
