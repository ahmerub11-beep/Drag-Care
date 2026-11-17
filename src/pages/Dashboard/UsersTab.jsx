import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { apiFetch } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function UsersTab() {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const { refreshKey } = useOutletContext();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isSuperAdmin) return undefined;

    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiFetch('/auth/users');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load users.');
        setUsersList(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return undefined;
  }, [isSuperAdmin, refreshKey]);

  const handleUpdateUserRole = async (userId, role) => {
    setError('');
    setMessage('');
    try {
      const response = await apiFetch(`/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update user role.');
      setUsersList((current) => current.map((user) => (
        user.id === userId ? { ...user, role } : user
      )));
      setMessage(`User role updated to ${role}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    const selectedUser = usersList.find((user) => user.id === userId);
    if (!selectedUser) return;

    if (userId === currentUser?.id) {
      setError('You cannot delete your own account.');
      return;
    }

    if (selectedUser.role === 'super-admin') {
      setError('Super admin accounts cannot be deleted from this panel.');
      return;
    }

    setError('');
    setMessage('');
    try {
      const response = await apiFetch(`/auth/users/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete user.');
      setUsersList((current) => current.filter((user) => user.id !== userId));
      setMessage(`User account deleted.`);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete user.');
    }
  };

  if (!isSuperAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {message && <div className="alert alert-success" role="status">{message}</div>}

      <div className="card shadow-sm border-0 rounded-3 border-top border-4 border-danger">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold m-0 text-danger d-flex align-items-center gap-2">
              <ShieldCheck size={20} />
              <span>Super Admin User & Role Controls</span>
            </h5>
            <p className="text-muted small m-0">Assign administrative privileges and manage user roles.</p>
          </div>
          <span className="badge bg-danger px-3 py-2">Restricted Access</span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small"><tr><th>User Name</th><th>Email Address</th><th>Phone</th><th>Current Role</th><th>Change Role</th><th className="text-end">Actions</th></tr></thead>
                <tbody className="small">
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td><span className={`badge ${user.role === 'super-admin' ? 'bg-danger' : user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>{user.role.toUpperCase()}</span></td>
                      <td>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={user.role}
                          onChange={(event) => handleUpdateUserRole(user.id, event.target.value)}
                        >
                          <option value="user">User (Customer)</option>
                          <option value="admin">Admin (Pharmacist)</option>
                          <option value="super-admin">Super Admin (Master)</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                          disabled={user.id === currentUser?.id || user.role === 'super-admin'}
                          onClick={() => handleDeleteUser(user.id)}
                          title={user.id === currentUser?.id ? 'You cannot delete your own account' : user.role === 'super-admin' ? 'Super admin accounts are protected' : 'Delete user'}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!usersList.length && <tr><td colSpan="6" className="text-center text-muted py-4">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
