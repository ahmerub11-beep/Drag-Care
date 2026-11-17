import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Banknote, FileText, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { apiFetch } from '../../api';
import { formatCurrency } from '../../utils/storefrontLocale';

export default function OverviewTab() {
  const { refreshKey } = useOutletContext();
  const [overview, setOverview] = useState({ medicines: [], prescriptions: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError('');
      try {
        const responses = await Promise.all([
          apiFetch('/medicines'),
          apiFetch('/prescriptions'),
          apiFetch('/orders')
        ]);
        const data = await Promise.all(responses.map(async (response) => {
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Unable to load dashboard data.');
          }
          return result;
        }));

        setOverview({
          medicines: Array.isArray(data[0]) ? data[0] : [],
          prescriptions: Array.isArray(data[1]) ? data[1] : [],
          orders: Array.isArray(data[2]) ? data[2] : []
        });
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [refreshKey]);

  const { medicines, prescriptions, orders } = overview;
  const totalRevenue = orders.reduce((total, order) => total + (Number(order.total) || 0), 0);
  const pendingRxCount = prescriptions.filter((prescription) => prescription.status?.includes('Pending')).length;
  const outOfStockCount = medicines.filter((medicine) => (Number(medicine.stockCount) || 0) < 20).length;

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>;
  }

  return (
    <div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-primary rounded-3 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Total Sales</div>
                  <div className="h4 fw-bold text-dark m-0">{formatCurrency(totalRevenue, 'PKR')}</div>
                </div>
                <div className="p-3 rounded-circle bg-primary text-white"><Banknote size={24} /></div>
              </div>
              <div className="small text-success mt-2"><TrendingUp size={14} className="me-1" /> Sales to date</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-success rounded-3 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Total Orders</div>
                  <div className="h4 fw-bold text-dark m-0">{orders.length}</div>
                </div>
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success"><ShoppingBag size={24} /></div>
              </div>
              <div className="small text-muted mt-2">All pharmacy orders</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-warning rounded-3 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Prescriptions</div>
                  <div className="h4 fw-bold text-dark m-0">{prescriptions.length}</div>
                </div>
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning"><FileText size={24} /></div>
              </div>
              <div className="small text-danger fw-semibold mt-2">{pendingRxCount} awaiting pharmacist review</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-info rounded-3 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Total Inventory</div>
                  <div className="h4 fw-bold text-dark m-0">{medicines.length} Items</div>
                </div>
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info"><Package size={24} /></div>
              </div>
              <div className="small text-muted mt-2">
                {outOfStockCount > 0 ? `${outOfStockCount} low stock alerts` : 'All items well-stocked'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold m-0 text-dark">Recent Prescriptions</h6>
              <Link to="/dashboard/prescriptions" className="btn btn-link btn-sm p-0 text-decoration-none">View All →</Link>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small"><tr><th>Ref ID</th><th>Patient</th><th>City</th><th>Status</th></tr></thead>
                <tbody className="small">
                  {prescriptions.slice(0, 4).map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="fw-bold text-primary">{prescription.id}</td>
                      <td>{prescription.patientName}</td>
                      <td>{prescription.city}</td>
                      <td><span className={`badge ${prescription.status?.includes('Pending') ? 'bg-warning text-dark' : 'bg-success'}`}>{prescription.status}</span></td>
                    </tr>
                  ))}
                  {prescriptions.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-3">No prescriptions found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold m-0 text-dark">Recent Orders</h6>
              <Link to="/dashboard/orders" className="btn btn-link btn-sm p-0 text-decoration-none">View All →</Link>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small"><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                <tbody className="small">
                  {orders.slice(0, 4).map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold text-primary">{order.id}</td>
                      <td>{order.customer?.name || 'Walk-in'}</td>
                      <td className="fw-bold">${(Number(order.total) || 0).toFixed(2)}</td>
                      <td><span className="badge bg-info text-dark">{order.status}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-3">No orders found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
