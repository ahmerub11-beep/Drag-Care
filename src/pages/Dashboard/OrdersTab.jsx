import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { apiFetch } from '../../api';

export default function OrdersTab() {
  const { refreshKey } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/orders');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load orders.');
        setOrders(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshKey]);

  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = window.setTimeout(() => setMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const handleUpdateOrderStatus = async (id, status) => {
    setError('');
    setMessage('');
    try {
      const response = await apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update order status.');
      const paymentStatus = status.toLowerCase().includes('delivered') ? 'Paid' : 'Pending';
      setOrders((current) => current.map((order) => (
        order.id === id ? { ...order, status, paymentStatus } : order
      )));
      setMessage(`Order ${id} marked as ${status}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update order status.');
    }
  };

  const handleDeleteOrder = async (id) => {
    setError('');
    setMessage('');
    try {
      const response = await apiFetch(`/orders/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete order.');
      setOrders((current) => current.filter((order) => order.id !== id));
      setMessage(`Order ${id} deleted.`);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete order.');
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold m-0 text-dark">Patient Pharmacy Orders</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr><th>Order ID</th><th>Customer Details</th><th>Items Ordered</th><th>Delivery Option</th><th>Payment</th><th>Total</th><th>Status</th><th className="text-end">Action</th></tr>
                </thead>
                <tbody className="small">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold text-primary">{order.id}</td>
                      <td>
                        <div className="fw-bold">{order.customer?.name || '—'}</div>
                        <div>{order.customer?.phone || '—'}</div>
                        <div>{[order.customer?.address, order.customer?.city].filter(Boolean).join(', ') || '—'}</div>
                        {order.customer?.notes && <div className="text-muted">Notes: {order.customer.notes}</div>}
                      </td>
                      <td>
                        {order.items?.length ? (
                          <ul className="list-unstyled mb-0">
                            {order.items.map((item, index) => (
                              <li key={`${item.id || item.name || 'item'}-${index}`}>
                                {item.name || item.productName || 'Unnamed product'}
                                {Number(item.quantity) > 1 && <span className="text-muted"> × {item.quantity}</span>}
                              </li>
                            ))}
                          </ul>
                        ) : '—'}
                      </td>
                      <td><span className={`badge ${order.deliverySpeed === 'express' ? 'bg-primary' : 'bg-light text-dark'}`}>{order.deliverySpeed === 'express' ? '⚡ 2-Hour Express' : 'Standard'}</span></td>
                      <td>
                        <div>{order.paymentMethod || '—'}</div>
                        <span className={`badge ${(order.paymentStatus === 'Paid' || order.status?.toLowerCase().includes('delivered')) ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.paymentStatus || (order.status?.toLowerCase().includes('delivered') ? 'Paid' : 'Pending')}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">${(Number(order.total) || 0).toFixed(2)}</td>
                      <td><span className="badge bg-info text-dark">{order.status}</span></td>
                      <td className="text-end">
                        <div className="d-flex flex-column align-items-end gap-2">
                          <select
                            className="form-select form-select-sm d-inline-block w-auto"
                            value={order.status}
                            onChange={(event) => handleUpdateOrderStatus(order.id, event.target.value)}
                          >
                            <option value="Processing at Central Dispensary">Processing</option>
                            <option value="Dispatched (Out for Delivery)">Out for Delivery</option>
                            <option value="Delivered Successfully">Delivered</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!orders.length && <tr><td colSpan="8" className="text-center text-muted py-4">No orders found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
