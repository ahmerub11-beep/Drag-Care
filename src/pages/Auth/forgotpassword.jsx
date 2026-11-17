import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to send password reset email.');
      setIsSent(true);
    } catch (submitError) {
      setError(submitError.message || 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page d-flex flex-column justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
              <span className="p-2 rounded-3 bg-primary text-white d-inline-flex">
                <Pill size={28} />
              </span>
              <span className="h3 fw-bold text-dark m-0">
                Drag<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-muted small">Reset your Drag Care pharmacy password</p>
          </div>

          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">
              {isSent ? (
                <div className="text-center py-3">
                  <div className="text-success mb-3">
                    <CheckCircle2 size={52} className="mx-auto" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Recovery Email Sent!</h4>
                  <p className="text-muted small mb-4">
                    If an account exists for <strong>{email}</strong>, you will receive a secure password reset link in your inbox.
                  </p>
                  <Link to="/auth/login" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    Return to Login
                  </Link>
                </div>
              ) : (
                <>
                  <h4 className="fw-bold text-dark mb-2 text-center">Forgot Password?</h4>
                  <p className="text-muted small text-center mb-4">
                    Enter the email associated with your pharmacy account and we'll send you instructions to reset your password.
                  </p>

                  {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Registered Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Mail size={16} className="text-muted" />
                        </span>
                        <input 
                          type="email" 
                          className="form-control bg-light border-start-0" 
                          placeholder="e.g. yourname@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      <Send size={16} />
                      <span>{loading ? 'Sending...' : 'Send Reset Instructions'}</span>
                    </button>
                  </form>

                  <hr className="my-4 text-muted" />

                  <div className="text-center small">
                    <Link to="/auth/login" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
                      <ArrowLeft size={14} />
                      <span>Back to Sign In</span>
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
};

export default ForgotPassword;
