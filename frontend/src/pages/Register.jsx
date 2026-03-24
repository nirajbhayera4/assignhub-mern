import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../services/auth';
import '../styles/Login.css';

const validateRegisterForm = ({ name, email, password, confirmPassword, role }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!role) {
    errors.role = 'Please choose an account type.';
  }

  return errors;
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role');
  const initialRole = selectedRole === 'provider' ? 'provider' : 'worker';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextForm = {
      ...formData,
      [name]: value,
    };

    setFormData(nextForm);
    setFieldErrors(validateRegisterForm(nextForm));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateRegisterForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      navigate('/marketplace', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to create your account because the backend server is unavailable.'
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
          <p className="login-kicker">Create Account</p>
          <h1>Create your AssignHub account and start working.</h1>
          <p className="login-description">
            Sign up with your own email address and password, then use AssignHub as a
            worker or provider.
          </p>
          <Link to="/login" className="login-back-link">
            Already have an account? Login
          </Link>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Create account</h2>
            <p>Set up your account in a few details.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={fieldErrors.name ? 'input-error' : ''}
                required
              />
              {fieldErrors.name ? <p className="login-field-error">{fieldErrors.name}</p> : null}
            </label>

            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={fieldErrors.email ? 'input-error' : ''}
                required
              />
              {fieldErrors.email ? <p className="login-field-error">{fieldErrors.email}</p> : null}
            </label>

            <label className="login-field">
              <span>Account Type</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={fieldErrors.role ? 'input-error' : ''}
              >
                <option value="worker">Worker</option>
                <option value="provider">Provider</option>
              </select>
              {fieldErrors.role ? <p className="login-field-error">{fieldErrors.role}</p> : null}
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={fieldErrors.password ? 'input-error' : ''}
                required
              />
              {fieldErrors.password ? (
                <p className="login-field-error">{fieldErrors.password}</p>
              ) : null}
            </label>

            <label className="login-field">
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={fieldErrors.confirmPassword ? 'input-error' : ''}
                required
              />
              {fieldErrors.confirmPassword ? (
                <p className="login-field-error">{fieldErrors.confirmPassword}</p>
              ) : null}
            </label>

            {error ? <p className="login-error">{error}</p> : null}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
