import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiFetch } from '../../api';
import { Eye, Trash2 } from 'lucide-react';

export default function PrescriptionsTab() {
  const { refreshKey } = useOutletContext();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fileLoadingId, setFileLoadingId] = useState('');
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/prescriptions');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load prescriptions.');
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [refreshKey]);

  const handleUpdateRxStatus = async (id, status) => {
    setError('');
    setMessage('');
    try {
      const response = await apiFetch(`/prescriptions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update prescription status.');
      setPrescriptions((current) => current.map((prescription) => (
        prescription.id === id ? { ...prescription, status } : prescription
      )));
      setMessage(`Prescription ${id} updated to ${status}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update prescription status.');
    }
  };

  const handleViewFile = async (prescription) => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      setError('Allow pop-ups to view the prescription file.');
      return;
    }

    setError('');
    setFileLoadingId(prescription.id);
    try {
      const response = await apiFetch(`/prescriptions/${prescription.id}/file`, { responseType: 'blob' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to open prescription file.');
      }

      const fileUrl = URL.createObjectURL(await response.blob());
      previewWindow.location.href = fileUrl;
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
    } catch (viewError) {
      previewWindow.close();
      setError(viewError.message || 'Unable to open prescription file.');
    } finally {
      setFileLoadingId('');
    }
  };

  const handleDeletePrescription = async () => {
    if (!prescriptionToDelete) return;
    setError('');
    setMessage('');
    setDeleting(true);
    try {
      const response = await apiFetch(`/prescriptions/${prescriptionToDelete.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete prescription.');
      setPrescriptions((current) => current.filter((prescription) => prescription.id !== prescriptionToDelete.id));
      setMessage(`Prescription ${prescriptionToDelete.id} deleted.`);
      setPrescriptionToDelete(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete prescription.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold m-0 text-dark">Doctor&apos;s Prescriptions Review</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
          ) : (
            <>
            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr><th>Ref ID</th><th>Patient Name</th><th>Phone / WhatsApp</th><th>City & Address</th><th>Prescription File</th><th>Special Instructions</th><th>Status</th><th className="text-end">Actions</th></tr>
                </thead>
                <tbody className="small">
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="fw-bold text-primary">{prescription.id}</td>
                      <td className="fw-semibold">{prescription.patientName}</td>
                      <td>{prescription.phone}</td>
                      <td><div>{prescription.city}</div><div className="text-muted small">{prescription.address}</div></td>
                      <td>
                        {prescription.fileName ? (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 text-nowrap"
                            disabled={fileLoadingId === prescription.id}
                            onClick={() => handleViewFile(prescription)}
                          >
                            <Eye size={14} />
                            {fileLoadingId === prescription.id ? 'Opening...' : prescription.fileName}
                          </button>
                        ) : <span className="text-muted">No file</span>}
                      </td>
                      <td className="text-muted" style={{ maxWidth: '200px' }}>{prescription.notes || 'None'}</td>
                      <td>
                        <span className={`badge ${prescription.status?.includes('Pending') ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {prescription.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex flex-column align-items-end gap-2">
                          <select
                            className="form-select form-select-sm d-inline-block w-auto"
                            value={prescription.status}
                            onChange={(event) => handleUpdateRxStatus(prescription.id, event.target.value)}
                          >
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Verified by Pharmacist">Verified by Pharmacist</option>
                            <option value="Prescription Packed (Cold-Chain)">Packed in Cold-Chain</option>
                            <option value="Dispatched with Courier">Dispatched</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                            aria-label={`Delete prescription ${prescription.id}`}
                            onClick={() => setPrescriptionToDelete(prescription)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!prescriptions.length && <tr><td colSpan="8" className="text-center text-muted py-4">No prescriptions found.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="prescriptions-mobile-list d-md-none p-3">
              {prescriptions.map((prescription) => (
                <article className="card prescription-mobile-card mb-3" key={prescription.id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="fw-bold text-primary text-break">{prescription.id}</div>
                        <h6 className="fw-bold mb-1 text-break">{prescription.patientName}</h6>
                        <div className="small text-muted text-break">{prescription.phone}</div>
                      </div>
                      <span className={`badge flex-shrink-0 ${prescription.status?.includes('Pending') ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <dl className="row small mb-3">
                      <dt className="col-4">Address</dt>
                      <dd className="col-8 text-break">{prescription.city}{prescription.address ? `, ${prescription.address}` : ''}</dd>
                      <dt className="col-4">Instructions</dt>
                      <dd className="col-8 text-break">{prescription.notes || 'None'}</dd>
                    </dl>
                    {prescription.fileName && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 w-100 mb-3"
                        disabled={fileLoadingId === prescription.id}
                        onClick={() => handleViewFile(prescription)}
                      >
                        <Eye size={14} />
                        <span className="text-truncate">
                          {fileLoadingId === prescription.id ? 'Opening...' : prescription.fileName}
                        </span>
                      </button>
                    )}
                    <div className="d-flex flex-column gap-2">
                      <select
                        className="form-select form-select-sm"
                        aria-label={`Update status for ${prescription.id}`}
                        value={prescription.status}
                        onChange={(event) => handleUpdateRxStatus(prescription.id, event.target.value)}
                      >
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Verified by Pharmacist">Verified by Pharmacist</option>
                        <option value="Prescription Packed (Cold-Chain)">Packed in Cold-Chain</option>
                        <option value="Dispatched with Courier">Dispatched</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-inline-flex justify-content-center align-items-center gap-1"
                        onClick={() => setPrescriptionToDelete(prescription)}
                      >
                        <Trash2 size={14} /> Delete Prescription
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </>
          )}
        </div>
      </div>

      {prescriptionToDelete && (
        <div
          className="modal show d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-prescription-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) setPrescriptionToDelete(null);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="delete-prescription-title">Delete prescription?</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={deleting}
                  onClick={() => setPrescriptionToDelete(null)}
                />
              </div>
              <div className="modal-body">
                This will permanently delete the prescription and its stored file.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill"
                  disabled={deleting}
                  onClick={() => setPrescriptionToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-pill"
                  disabled={deleting}
                  onClick={handleDeletePrescription}
                >
                  {deleting ? 'Deleting...' : 'Delete Prescription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
