import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { apiFetch, resolveImageUrl } from '../../api';
import { formatCurrency, USD_TO_PKR_RATE } from '../../utils/storefrontLocale';
import AddMedicineModal from './AddMedicineModal';

const initialMedicine = {
  name: '',
  category: 'otc',
  genericSalt: '',
  manufacturer: '',
  price: '',
  originalPrice: '',
  stockCount: 50,
  isRxRequired: false,
  isColdChain: false,
  expiryDate: '',
  packSize: ''
};

export default function MedicinesTab() {
  const { refreshKey, showAddMedicine, setShowAddMedicine } = useOutletContext();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMed, setNewMed] = useState(initialMedicine);
  const [medicineToEdit, setMedicineToEdit] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/medicines');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load medicines.');
        setMedicines(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load medicines.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [refreshKey]);

  const handleAddMedicineSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      Object.entries(newMed).forEach(([key, value]) => {
        const apiValue = ['price', 'originalPrice'].includes(key) && value !== ''
          ? (Number(value) / USD_TO_PKR_RATE).toFixed(4)
          : value;
        formData.append(key, String(apiValue));
      });
      if (imageFile) formData.append('image', imageFile);

      const response = await apiFetch(
        medicineToEdit ? `/medicines/${medicineToEdit.id}` : '/medicines',
        {
          method: medicineToEdit ? 'PUT' : 'POST',
          body: formData
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success || !data.medicine) {
        throw new Error(data.error || `Failed to ${medicineToEdit ? 'update' : 'add'} medicine.`);
      }

      if (medicineToEdit) {
        setMedicines((current) => current.map((medicine) => (
          medicine.id === medicineToEdit.id ? data.medicine : medicine
        )));
      } else {
        setMedicines((current) => [data.medicine, ...current]);
      }
      setShowAddMedicine(false);
      setMedicineToEdit(null);
      setNewMed({ ...initialMedicine });
      setImageFile(null);
      setMessage(`Medicine ${medicineToEdit ? 'updated' : 'added'} successfully.`);
    } catch (submitError) {
      setError(submitError.message || 'Failed to add medicine.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!medicineToDelete) return;
    setError('');
    setMessage('');
    setDeleting(true);
    try {
      const response = await apiFetch(`/medicines/${medicineToDelete.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error deleting medicine.');
      setMedicines((current) => current.filter((medicine) => medicine.id !== medicineToDelete.id));
      setMedicineToDelete(null);
      setMessage('Medicine removed from inventory.');
    } catch (deleteError) {
      setError(deleteError.message || 'Error deleting medicine.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const query = searchTerm.toLowerCase();
    return !query
      || medicine.name?.toLowerCase().includes(query)
      || medicine.genericSalt?.toLowerCase().includes(query);
  });

  return (
    <>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="fw-bold m-0 text-dark">Medicines & Healthcare Inventory</h5>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Filter by name / salt..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ width: '220px' }}
            />
            <button
              className="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1"
              onClick={() => {
                setMedicineToEdit(null);
                setNewMed({ ...initialMedicine });
                setImageFile(null);
                setShowAddMedicine(true);
              }}
            >
              <Plus size={14} /> Add Medicine
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr><th>Product</th><th>Active Salt Composition</th><th>Category</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Badges</th><th className="text-end">Actions</th></tr>
                </thead>
                <tbody className="small">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={resolveImageUrl(medicine.image)} alt={medicine.name} width="40" height="40" className="rounded object-fit-cover bg-light border" />
                          <div>
                            <div className="fw-bold text-dark">{medicine.name}</div>
                            <div className="text-muted small">{medicine.manufacturer}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted fst-italic">{medicine.genericSalt}</td>
                      <td><span className="badge bg-secondary text-uppercase">{medicine.category}</span></td>
                      <td className="fw-bold text-primary">{formatCurrency(medicine.price, 'PKR')}</td>
                      <td><span className={`badge ${(medicine.stockCount || 0) < 25 ? 'bg-danger' : 'bg-success'}`}>{medicine.stockCount || 50} units</span></td>
                      <td className="text-muted">{medicine.expiryDate}</td>
                      <td>
                        {medicine.isRxRequired && <span className="badge bg-danger me-1">Rx</span>}
                        {medicine.isColdChain && <span className="badge bg-info text-dark">❄ 2-8°C</span>}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-primary btn-sm p-1 me-1"
                          title="Edit medicine"
                          aria-label={`Edit ${medicine.name}`}
                          onClick={() => {
                            setMedicineToEdit(medicine);
                            setNewMed({
                              ...initialMedicine,
                              ...medicine,
                              price: String((Number(medicine.price || 0) * USD_TO_PKR_RATE).toFixed(2)),
                              originalPrice: String((Number(medicine.originalPrice || 0) * USD_TO_PKR_RATE).toFixed(2)),
                              stockCount: String(medicine.stockCount ?? 0)
                            });
                            setImageFile(null);
                            setShowAddMedicine(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm p-1" title="Delete medicine" onClick={() => setMedicineToDelete(medicine)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!filteredMedicines.length && (
                    <tr><td colSpan="8" className="text-center text-muted py-4">No medicines found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddMedicineModal
        showAddModal={showAddMedicine}
        setShowAddModal={setShowAddMedicine}
        newMed={newMed}
        setNewMed={setNewMed}
        imageFile={imageFile}
        setImageFile={setImageFile}
        handleAddMedicineSubmit={handleAddMedicineSubmit}
        saving={saving}
        editing={Boolean(medicineToEdit)}
        currentImage={medicineToEdit ? resolveImageUrl(medicineToEdit.image) : ''}
        onClose={() => {
          setShowAddMedicine(false);
          setMedicineToEdit(null);
          setNewMed({ ...initialMedicine });
          setImageFile(null);
        }}
      />

      {medicineToDelete && (
        <div
          className="modal show d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-medicine-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) setMedicineToDelete(null);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="delete-medicine-title">Delete medicine?</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={deleting}
                  onClick={() => setMedicineToDelete(null)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{medicineToDelete.name}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill"
                  disabled={deleting}
                  onClick={() => setMedicineToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-pill"
                  disabled={deleting}
                  onClick={handleDeleteMedicine}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
