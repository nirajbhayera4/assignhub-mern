import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, login } from '../services/auth';
import '../styles/Login.css';

const AUTH_ONLY_ROUTES = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/',
  '/role-selection',
]);

const validateLoginForm = ({ email, password }) => {
  const nextErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    nextErrors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = 'Enter a valid email address.';
  }

  if (!password) {
    nextErrors.password = 'Password is required.';
  } else if (password.length < 6) {
    nextErrors.password = 'Password must be at least 6 characters.';
  }

  return nextErrors;
};

const getSafeRedirectPath = (location) => {
  const requestedPath = location.state?.from?.pathname;

  if (!requestedPath || AUTH_ONLY_ROUTES.has(requestedPath)) {
    return '/marketplace';
  }

  return requestedPath;
};

const getLoginErrorMessage = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (!error.response) {
    return 'Login failed because the backend server is unavailable. Start the backend and try again.';
  }

  if (status === 401 && message === 'Invalid credentials') {
    return 'No account matched that email and password. Please use the same email you registered with.';
  }

  return message || 'Login failed. Check your credentials and try again.';
};

const Login = () => {
  const location = useLocation();
  const redirectTo = getSafeRedirectPath(location);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    setFieldErrors(validateLoginForm(nextFormData));
    setError('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouchedFields((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);

    setFieldErrors(validationErrors);
    setTouchedFields({
      email: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0 || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      window.location.replace(redirectTo);
    } catch (err) {
      setError(getLoginErrorMessage(err));
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
                onBlur={handleBlur}
                placeholder="you@example.com"
                autoComplete="email"
                className={touchedFields.email && fieldErrors.email ? 'input-error' : ''}
                aria-invalid={Boolean(touchedFields.email && fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                required
              />
              {touchedFields.email && fieldErrors.email ? (
                <p id="login-email-error" className="login-field-error">
                  {fieldErrors.email}
                </p>
              ) : null}
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={touchedFields.password && fieldErrors.password ? 'input-error' : ''}
                aria-invalid={Boolean(touchedFields.password && fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                required
              />
              {touchedFields.password && fieldErrors.password ? (
                <p id="login-password-error" className="login-field-error">
                  {fieldErrors.password}
                </p>
              ) : null}
            </label>

            {error ? (
              <div className="login-error-block">
                <p className="login-error">{error}</p>
                <Link to="/register" className="login-inline-link">
                  Create an account
                </Link>
              </div>
            ) : null}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/register">Create account</Link>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
