import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Pill } from 'lucide-react';
import { apiFetch } from '../../api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to reset your password.');
      setSuccess(true);
    } catch (resetError) {
      setError(resetError.message || 'Unable to reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100 d-flex flex-column justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
              <span className="p-2 rounded-3 bg-primary text-white d-inline-flex"><Pill size={28} /></span>
              <span className="h3 fw-bold text-dark m-0">Drag<span className="text-primary">Care</span></span>
            </Link>
            <p className="text-muted small">Choose a new password for your account</p>
          </div>

          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">
              {success ? (
                <div className="text-center">
                  <h4 className="fw-bold text-dark mb-2">Password Updated</h4>
                  <p className="text-muted small mb-4">Your password has been reset. You can now sign in with your new password.</p>
                  <Link to="/auth/login" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">Return to Login</Link>
                </div>
              ) : (
                <>
                  <h4 className="fw-bold text-dark mb-2 text-center">Reset Password</h4>
                  {!token ? (
                    <>
                      <p className="text-muted small text-center">This reset link is missing or invalid. Request a new one to continue.</p>
                      <Link to="/auth/forgot-password" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">Request a new link</Link>
                    </>
                  ) : (
                    <>
                      <p className="text-muted small text-center mb-4">Enter a new password with at least 8 characters.</p>
                      {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary" htmlFor="new-password">New Password</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><LockKeyhole size={16} className="text-muted" /></span>
                            <input
                              id="new-password"
                              type="password"
                              className="form-control bg-light border-start-0"
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              autoComplete="new-password"
                              minLength={8}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="form-label small fw-bold text-secondary" htmlFor="confirm-password">Confirm New Password</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><LockKeyhole size={16} className="text-muted" /></span>
                            <input
                              id="confirm-password"
                              type="password"
                              className="form-control bg-light border-start-0"
                              value={confirmPassword}
                              onChange={(event) => setConfirmPassword(event.target.value)}
                              autoComplete="new-password"
                              minLength={8}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={loading}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </>
                  )}
                  <hr className="my-4 text-muted" />
                  <div className="text-center small">
                    <Link to="/auth/login" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
                      <ArrowLeft size={14} /><span>Back to Sign In</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
