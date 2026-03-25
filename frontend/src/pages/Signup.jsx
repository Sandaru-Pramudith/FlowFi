import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login({ _id: data._id, fullName: data.fullName, email: data.email }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-logo">FlowFi</div>

        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Join us today by entering your details below.</p>

        <div className="avatar-upload">
          👤
          <span className="avatar-upload-badge">+</span>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="John"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 Characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <span className="spinner" /> : 'SIGN UP'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-card">
            <div className="auth-right-label">Track Your Income & Expenses</div>
            <div className="auth-right-value">$430,000</div>
          </div>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            Smart Finance Tracking
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>
            Get full visibility into your income and expenses with beautiful charts and real-time insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
