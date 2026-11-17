import { useEffect, useRef, useState } from 'react';

export default function AddMedicineModal({ showAddModal, setShowAddModal, newMed, setNewMed, imageFile, setImageFile, handleAddMedicineSubmit, saving, editing = false, currentImage = '', onClose })
 {
  const [imagePreview, setImagePreview] = useState('');
  const imageInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!imageFile) {
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    }
  }, [imageFile, imagePreview]);

  const closeModal = () => {
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (onClose) onClose();
    else setShowAddModal(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  return (
    <>
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">{editing ? 'Edit Medicine' : 'Add Medicine to Central Inventory'}</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" disabled={saving} onClick={closeModal}></button>
              </div>

              <form onSubmit={handleAddMedicineSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Medicine Name*</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control"
                        placeholder="Enter medicine name"
                        value={newMed.name}
                        onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Active Salt Formula*</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control"
                        value={newMed.genericSalt}
                        onChange={(e) => setNewMed({ ...newMed, genericSalt: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold" htmlFor="medicine-image">Medicine Image</label>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        {(imageFile && imagePreview || !imageFile && currentImage) && (
                          <img
                            src={imageFile ? imagePreview : currentImage}
                            alt="Medicine preview"
                            width="80"
                            height="80"
                            className="rounded border object-fit-cover"
                          />
                        )}
                        <div>
                          <input
                            ref={imageInputRef}
                            id="medicine-image"
                            type="file"
                            className="form-control"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={handleImageChange}
                          />
                          <div className="form-text"> PNG, JPG, WEBP or GIF; maximum 5 MB.</div>
                        </div>
                        {imageFile && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                              if (imageInputRef.current) imageInputRef.current.value = '';
                            }}
                          >
                            Remove image
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Category</label>
                      <select 
                        className="form-select"
                        value={newMed.category}
                        onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                      >
                        <option value="otc">OTC & Pain Relief</option>
                        <option value="prescription">Prescription (Rx)</option>
                        <option value="antibiotics">Antibiotic</option>
                        <option value="diabetes">Diabetes & Blood Sugar</option>
                        <option value="heart">Heart & Blood Pressure</option>
                        <option value="supplements">Vitamins & Supplements</option>
                        <option value="devices">Medical Devices</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Manufacturer / Company</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={newMed.manufacturer}
                        onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold" htmlFor="medicine-price">Selling Price (PKR)*</label>
                      <input 
                        id="medicine-price"
                        type="number" 
                        step="0.01"
                        min="0.01"
                        required 
                        className="form-control"
                        value={newMed.price}
                        onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold" htmlFor="medicine-original-price">Original Price (PKR)</label>
                      <input
                        id="medicine-original-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={newMed.originalPrice}
                        onChange={(e) => setNewMed({ ...newMed, originalPrice: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Initial Stock Quantity</label>
                      <input 
                        type="number" 
                        min="0"
                        className="form-control"
                        value={newMed.stockCount}
                        onChange={(e) => setNewMed({ ...newMed, stockCount: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="MM/YYYY"
                        value={newMed.expiryDate}
                        onChange={(e) => setNewMed({ ...newMed, expiryDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Packaging Details</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="e.g. Strip of 10 Tablets"
                        value={newMed.packSize}
                        onChange={(e) => setNewMed({ ...newMed, packSize: e.target.value })}
                      />
                    </div>

                    <div className="col-12 mt-3">
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="rxCheck" 
                            checked={newMed.isRxRequired}
                            onChange={(e) => setNewMed({ ...newMed, isRxRequired: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="rxCheck">
                            Prescription Required (Rx Only)
                          </label>
                        </div>

                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="coldCheck" 
                            checked={newMed.isColdChain}
                            onChange={(e) => setNewMed({ ...newMed, isColdChain: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="coldCheck">
                            Cold Chain (2°C - 8°C Storage)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm rounded-pill" disabled={saving} onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm rounded-pill fw-semibold" disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Save to Central Inventory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
