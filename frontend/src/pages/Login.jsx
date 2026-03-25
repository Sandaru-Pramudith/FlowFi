import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login({ _id: data._id, fullName: data.fullName, email: data.email, profileImage: data.profileImage }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-logo">Expense Tracker</div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Please enter your details to log in</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            {loading ? <span className="spinner" /> : 'LOGIN'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">SignUp</Link>
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-right-card">
            <div className="auth-right-label">Track Your Income & Expenses</div>
            <div className="auth-right-value">$430,000</div>
          </div>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            Take Control of Your Finances
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>
            Track income and expenses, visualize spending trends, and make smarter financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
