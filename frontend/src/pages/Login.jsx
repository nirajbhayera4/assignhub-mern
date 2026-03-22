import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/marketplace';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-shell">
        <div className="login-copy">
          <p className="login-kicker">AssignHub Access</p>
          <h1>Login before using the marketplace tools.</h1>
          <p className="login-description">
            We gate the interactive experience behind authentication so assignments,
            wallet data, and dashboards stay tied to a real account.
          </p>
          <Link to="/role-selection" className="login-back-link">
            Back to role selection
          </Link>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign in</h2>
            <p>Use your AssignHub account to continue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className="login-error">{error}</p> : null}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
