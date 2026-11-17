import { FileUp, ShieldCheck } from 'lucide-react';
import { useStorefront } from '../../../components/ProductCatalog';

export default function PrescriptionUploadBanner({ onOpenPrescription }) {
  const { t } = useStorefront();
  return (
    <div className="container">
      <div className="prescription-banner card bg-primary text-white my-4 p-3 p-md-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div className="prescription-banner-content flex-grow-1">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
            <ShieldCheck size={14} />
            <span>{t('Official DRAP & HIPAA Compliant Safe Upload')}</span>
          </div>
          <h3>{t("Have a Doctor's Prescription?")}</h3>
          <p>
            {t('Upload your valid prescription slip. Our qualified pharmacists will verify the dosage, check for any drug interactions, and arrange fast doorstep delivery.')}
          </p>

          <div className="prescription-steps">
            <div className="step-chip">
              <span className="step-num">1</span>
              <span>{t('Upload Prescription Photo')}</span>
            </div>
            <div className="step-chip">
              <span className="step-num">2</span>
              <span>{t('Pharmacist Calls & Confirms')}</span>
            </div>
            <div className="step-chip">
              <span className="step-num">3</span>
              <span>{t('Doorstep Delivery')}</span>
            </div>
          </div>
        </div>

        <div>
          <button 
            className="btn-upload-lg btn btn-light text-primary d-flex align-items-center justify-content-center gap-2 w-100"
            onClick={onOpenPrescription}
          >
            <FileUp size={20} />
            <span>{t('Upload Prescription Now')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
