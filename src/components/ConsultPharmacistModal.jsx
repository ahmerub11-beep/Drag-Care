import { useState } from 'react';
import { CheckCircle2, UserCheck, Clock } from 'lucide-react';
import { apiFetch } from '../api';
import { useStorefront } from './ProductCatalog';

export default function ConsultPharmacistModal() {
  const { isConsultOpen, setIsConsultOpen, t } = useStorefront();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('dosage');
  const [query, setQuery] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isConsultOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiFetch('/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          topic,
          query
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit consultation request');
      }

      setIsSent(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResetAndClose = () => {
    setIsSent(false);
    setName('');
    setPhone('');
    setQuery('');
    setIsConsultOpen(false);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50 overflow-auto" role="dialog" aria-modal="true" onClick={handleResetAndClose}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content p-3 p-md-4">
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={handleResetAndClose} aria-label="Close">
        </button>

        {isSent ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1D395F', marginBottom: '8px' }}>
              {t('Pharmacist Consultation Requested!')}
            </h3>

            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, marginBottom: '20px' }}>
              {t('Thank you,')} <strong>{name}</strong>. {t('Our on-duty clinical pharmacist has received your inquiry and will call you back within 10-15 minutes.')} <strong>{phone}</strong>
            </p>

            <button 
              className="btn btn-primary w-100"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleResetAndClose}
            >
              {t('Close')}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5EEFA', color: '#7A45A9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#1D395F' }}>
                {t('Free Pharmacist Consultation')}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '18px' }}>
              {t('Speak with a licensed Doctor of Pharmacy for drug interaction checks, dosage instructions, or generic brand advice.')}
            </p>

            <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', padding: '10px 14px', borderRadius: '8px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7A45A9', fontWeight: 600 }}>
              <Clock size={16} />
              <span>{t('Current On-Duty Pharmacist:')} Dr. Bilal Qureshi (Pharm-D, RPh)</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                  {t('Your Name*')}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={t('Enter your full name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                  {t('Phone / WhatsApp Number*')}
                </label>
                <input 
                  type="tel" 
                  required
                  placeholder={t('Enter your phone number')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                  {t('Inquiry Topic')}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-select"
                >
                  <option value="dosage">{t('Dosage Directions & Timing')}</option>
                  <option value="interaction">{t('Drug-to-Drug Interactions')}</option>
                  <option value="substitute">{t('Affordable Generic Substitute Inquiry')}</option>
                  <option value="cold-chain">{t('Insulin & Cold-Chain Storage Guidance')}</option>
                  <option value="other">{t('General Medication Question')}</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                  {t('Your Question / Medicine Name')}
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder={t('Describe your symptoms, current medications, or question...')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-control"
                />
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-100"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {t('Request Free Callback')}
              </button>
            </form>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
