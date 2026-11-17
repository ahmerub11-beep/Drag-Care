import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pill, LogIn, User, Lock } from 'lucide-react';
import { hasDashboardAccess } from '../../utils/roles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlertMsg({ text: 'Please fill in both email and password.', type: 'danger' });
      return;
    }

    setAlertMsg({ text: 'Logging in...', type: 'info' });
    const res = await login(email, password);
    if (res.success) {
      setAlertMsg({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        if (hasDashboardAccess(res.user.role)) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }, 700);
    } else {
      setAlertMsg({ text: res.error || 'Invalid credentials.', type: 'danger' });
    }
  };

  return (
    <div className="container auth-page d-flex flex-column justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          {/* Brand Header */}
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
              <span className="p-2 rounded-3 bg-primary text-white d-inline-flex">
                <Pill size={28} />
              </span>
              <span className="h3 fw-bold text-dark m-0">
                Drag<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-muted small">Sign in to access your pharmacy account & medical services</p>
          </div>

          {/* Main Card */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">
              <h4 className="fw-bold text-dark mb-4 text-center">Account Sign In</h4>

              {alertMsg.text && (
                <div className={`alert alert-${alertMsg.type} py-2 small`} role="alert">
                  {alertMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={16} className="text-muted" />
                    </span>
                    <input 
                      type="email" 
                      className="form-control bg-light border-start-0" 
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-secondary m-0">Password</label>
                    <Link to="/auth/forgot-password" className="small text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input 
                      type="password" 
                      className="form-control bg-light border-start-0" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                  <label className="form-check-label small text-muted" htmlFor="rememberMe">
                    Remember my credentials
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  <LogIn size={18} />
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                </button>
              </form>

              <hr className="my-4 text-muted" />

              <div className="text-center small text-muted">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-primary fw-bold text-decoration-none">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <Link to="/" className="small text-muted text-decoration-none">
              ← Return to Drag Care Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
