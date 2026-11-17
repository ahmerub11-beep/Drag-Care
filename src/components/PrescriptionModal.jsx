import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../api';
import { useStorefront } from './ProductCatalog';

export default function PrescriptionModal() {
  const { isPrescriptionOpen, setIsPrescriptionOpen, t } = useStorefront();
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rxTrackingId, setRxTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isPrescriptionOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setError('');
    if (!file) {
      setUploadedFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PNG, JPG, WEBP, or GIF image.');
      e.target.value = '';
      setUploadedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Prescription file must be 10 MB or smaller.');
      e.target.value = '';
      setUploadedFile(null);
      return;
    }
    setUploadedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(uploadedFile instanceof File)) {
      setError('Please select a real prescription image to upload.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('address', address);
      formData.append('notes', notes);
      formData.append('prescriptionFile', uploadedFile);

      const response = await apiFetch('/prescriptions', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit prescription');
      }

      setRxTrackingId(data.prescription?.id || 'DRAG-RX-' + Date.now());
      setIsSubmitted(true);
    } catch (error) {
      setError(error.message || 'Unable to submit prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    if (isSubmitting) return;
    setIsSubmitted(false);
    setUploadedFile(null);
    setError('');
    setPatientName('');
    setPhone('');
    setAddress('');
    setNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsPrescriptionOpen(false);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50 overflow-auto" role="dialog" aria-modal="true" onClick={handleResetAndClose}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content p-3 p-md-4">
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={handleResetAndClose} aria-label="Close">
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1D395F', marginBottom: '8px' }}>
              {t('Prescription Successfully Submitted!')}
            </h3>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'inline-block', margin: '14px 0', fontSize: '14px' }}>
              {t('Reference ID:')} <strong style={{ color: '#7A45A9' }}>{rxTrackingId}</strong>
            </div>

            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
              {t('Thank you,')} <strong>{patientName}</strong>! {t('Our licensed pharmacist is reviewing your prescription and medicine availability. We will call you within 15 minutes.')} <strong>{phone}</strong>
            </p>

            <button 
              className="btn btn-primary w-100" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleResetAndClose}
            >
              {t('Done & Return to Store')}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F5EEFA', color: '#7A45A9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1D395F' }}>
                {t("Order via Doctor's Prescription")}
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '20px' }}>
              {t('Upload a clear photo of your prescription. Our pharmacists will review it, check inventory, and contact you with the best available prices.')}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Dropzone */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '6px' }}>
                  {t('Upload Prescription Image*')}
                </label>

                <div 
                  style={{
                    border: '2px dashed #7A45A9',
                    borderRadius: '12px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#FAF7FB',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <Upload size={30} color="#7A45A9" style={{ margin: '0 auto 8px' }} />
                  {uploadedFile ? (
                    <div style={{ color: '#059669', fontWeight: 700, fontSize: '14px' }}>
                      ✓ File Attached: {uploadedFile.name}
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1D395F' }}>
                        {t('Drag & Drop or Click to Select File')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                        {t('PNG, JPG, WEBP, GIF up to 10MB')}
                      </div>
                    </>
                  )}
                </div>

              </div>

              {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

              {/* Patient Details */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('Patient Name*')}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={t('Enter full name')}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('WhatsApp / Phone Number*')}
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder={t('Enter phone number')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-4">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('City*')}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-select"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>

                <div className="col-12 col-sm-8">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                    {t('Delivery Street Address*')}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={t('House, Street, Area')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1D395F', marginBottom: '4px' }}>
                  {t("Doctor's Instructions or Specific Requests")}
                </label>
                <textarea 
                  rows={2}
                  placeholder={t("Enter doctor's instructions or specific requests...")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>{t('Your medical information is protected by healthcare confidentiality protocols.')}</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={isSubmitting}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isSubmitting ? t('Uploading...') : t('Submit Prescription for Verification')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
