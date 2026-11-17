import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pill, UserPlus, User, Mail, Phone, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setAlertMsg({ text: 'Please complete all required fields.', type: 'danger' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMsg({ text: 'Passwords do not match.', type: 'danger' });
      return;
    }

    if (formData.password.length < 6) {
      setAlertMsg({ text: 'Password must be at least 6 characters long.', type: 'danger' });
      return;
    }

    setAlertMsg({ text: 'Creating your account...', type: 'info' });
    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });

    if (res.success) {
      setAlertMsg({ text: 'Account created successfully! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 700);
    } else {
      setAlertMsg({ text: res.error || 'Registration failed.', type: 'danger' });
    }
  };

  return (
    <div className="container auth-page d-flex flex-column justify-content-center">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
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
            <p className="text-muted small">Create an account to manage your medical records, refills & orders</p>
          </div>

          {/* Main Registration Card */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">
              <h4 className="fw-bold text-dark mb-4 text-center">Create New Account</h4>

              {alertMsg.text && (
                <div className={`alert alert-${alertMsg.type} py-2 small`} role="alert">
                  {alertMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Full Name*</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={16} className="text-muted" />
                    </span>
                    <input 
                      type="text" 
                      name="name"
                      className="form-control bg-light border-start-0" 
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-secondary">Email Address*</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input 
                        type="email" 
                        name="email"
                        className="form-control bg-light border-start-0" 
                        placeholder="Enter your email "
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-secondary">Phone / WhatsApp</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Phone size={16} className="text-muted" />
                      </span>
                      <input 
                        type="tel" 
                        name="phone"
                        className="form-control bg-light border-start-0" 
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-secondary">Password*</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input 
                        type="password" 
                        name="password"
                        className="form-control bg-light border-start-0" 
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-secondary">Confirm Password*</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        className="form-control bg-light border-start-0" 
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="termsCheck" required defaultChecked />
                  <label className="form-check-label small text-muted" htmlFor="termsCheck">
                    I agree to Drag Care's <span className="text-primary">Prescription Terms & Healthcare Policy</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  <UserPlus size={18} />
                  <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                </button>
              </form>

              <hr className="my-4 text-muted" />

              <div className="text-center small text-muted">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary fw-bold text-decoration-none">
                  Sign In
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

export default Register;