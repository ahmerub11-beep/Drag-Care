import { 
  ShieldCheck, 
  Clock, 
  Upload, 
  FileText, 
  ArrowRight, 
  ThermometerSnowflake, 
  CheckCircle2,
} from 'lucide-react';
import { useStorefront } from '../../../components/ProductCatalog';

export default function HeroSlider() {
  const { setIsPrescriptionOpen, handleScrollToSection, t } = useStorefront();
  return (
    <section className="hero-wrapper py-3 py-md-4" id="home">
      <div className="container">
        <div className="hero-grid row g-4 g-lg-5">
          {/* Main Hero Card */}
          <div className="col-12 col-lg-8">
            <div className="hero-main-card card h-100 border-0 shadow-sm p-3 p-sm-4 p-lg-5">
              <div className="hero-badge">
                <ShieldCheck size={16} />
                <span>DRAP & Licensed Pharmacy Council Certified</span>
              </div>

              <h1 className="hero-title display-5 fw-bold">
                Your Trusted <span>Healthcare </span> & Digital Pharmacy Partner'
              </h1>

              <p className="hero-subtitle fs-6">
                Order authentic prescription drugs, chronic disease refills, vitamins, and diagnostics. Delivered in certified temperature-monitored packaging right to your door.
              </p>

              <div className="hero-cta-group d-flex flex-column flex-sm-row gap-2">
                <button 
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleScrollToSection('catalog-section')}
                >
                  <span>Browse Medicines</span>
                  <ArrowRight size={17} />
                </button>
              </div>

              {/* Quick Benefits Chips */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#1D395F' }}>
                  <Clock size={16} color="#7A45A9" />
                  <span>2-Hour Express Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#1D395F' }}>
                  <ThermometerSnowflake size={16} color="#0284C7" />
                  <span>Cold-Chain 2°C - 8°C Monitored</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#1D395F' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>100% Genuine Pharma Sourced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Prescription Upload Card on the right */}
          <div className="col-12 col-lg-4">
            <div className="hero-side-card card h-100 border-0 shadow-sm p-3 p-sm-4">
              <div>
                <div className="side-card-header">
                  <div className="side-card-icon">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="side-card-title">{t('Order via Prescription')}</h3>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>● {t('Instant Pharmacist Review')}</span>
                  </div>
                </div>

                <p className="side-card-desc">
                  Don\'t have time to search medicine names? Simply take a picture of your doctor’s prescription slip and upload here.
                </p>

                {/* Upload Drop Area */}
                <div 
                  className="side-upload-dropzone"
                  onClick={() => setIsPrescriptionOpen(true)}
                >
                  <Upload size={32} color="#7A45A9" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#1D395F', marginBottom: '4px' }}>
                    {t('Click to Upload Prescription Slip')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Supports JPG, PNG, WEBP, GIF up to 10MB
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1D395F', marginBottom: '4px' }}>
                  'How it works:
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                  1. Upload photo → 2. Pharmacist verifies dosage & calls you → 3. Doorstep delivery with temperature monitoring.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
