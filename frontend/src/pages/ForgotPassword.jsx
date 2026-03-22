import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordResetOtp, resetPassword } from '../services/auth';
import '../styles/Login.css';

const validateRequest = (email) => {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address.';
  }

  return '';
};

const validateReset = ({ otp, password, confirmPassword }) => {
  const errors = {};

  if (!otp.trim()) {
    errors.otp = 'OTP is required.';
  } else if (!/^\d{6}$/.test(otp.trim())) {
    errors.otp = 'OTP must be a 6-digit code.';
  }

  if (!password) {
    errors.password = 'New password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm the new password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpForm, setOtpForm] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [step, setStep] = useState(1);
  const [requestError, setRequestError] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [developmentOtp, setDevelopmentOtp] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    const emailError = validateRequest(email);

    if (emailError) {
      setRequestError(emailError);
      return;
    }

    setRequestLoading(true);
    setRequestError('');

    try {
      const response = await requestPasswordResetOtp(email.trim());
      setRequestSuccess(response.message);
      setDevelopmentOtp(response.developmentOtp || '');
      setStep(2);
    } catch (err) {
      setRequestError(
        err.response?.data?.message || 'Unable to send OTP right now. Please try again.'
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const handleOtpChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'otp' ? value.replace(/\D/g, '').slice(0, 6) : value;
    const nextForm = {
      ...otpForm,
      [name]: nextValue,
    };

    setOtpForm(nextForm);
    setFieldErrors(validateReset(nextForm));
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const errors = validateReset(otpForm);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setResetLoading(true);
    setRequestError('');

    try {
      await resetPassword({
        email: email.trim(),
        otp: otpForm.otp.trim(),
        password: otpForm.password,
      });
      navigate('/marketplace', { replace: true });
    } catch (err) {
      setRequestError(
        err.response?.data?.message || 'Unable to reset password right now.'
      );
    } finally {
      setResetLoading(false);
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
          <p className="login-kicker">Password Recovery</p>
          <h1>Reset your password with a one-time code.</h1>
          <p className="login-description">
            Enter your account email, receive an OTP, and set a fresh password without leaving the app.
          </p>
          <Link to="/login" className="login-back-link">
            Back to login
          </Link>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>{step === 1 ? 'Forgot password' : 'Enter OTP'}</h2>
            <p>
              {step === 1
                ? 'We will send a 6-digit OTP to your email.'
                : `Use the code sent to ${email.trim()}.`}
            </p>
          </div>

          {step === 1 ? (
            <form className="login-form" onSubmit={handleRequestOtp}>
              <label className="login-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setRequestError('');
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              {requestError ? <p className="login-error">{requestError}</p> : null}
              {requestSuccess ? <p className="login-success">{requestSuccess}</p> : null}

              <button type="submit" className="login-submit" disabled={requestLoading}>
                {requestLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleResetPassword}>
              <label className="login-field">
                <span>OTP</span>
                <input
                  type="text"
                  name="otp"
                  value={otpForm.otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  className={fieldErrors.otp ? 'input-error' : ''}
                  required
                />
                {fieldErrors.otp ? <p className="login-field-error">{fieldErrors.otp}</p> : null}
              </label>

              <label className="login-field">
                <span>New Password</span>
                <input
                  type="password"
                  name="password"
                  value={otpForm.password}
                  onChange={handleOtpChange}
                  placeholder="Enter new password"
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
                  value={otpForm.confirmPassword}
                  onChange={handleOtpChange}
                  placeholder="Confirm new password"
                  className={fieldErrors.confirmPassword ? 'input-error' : ''}
                  required
                />
                {fieldErrors.confirmPassword ? (
                  <p className="login-field-error">{fieldErrors.confirmPassword}</p>
                ) : null}
              </label>

              {developmentOtp ? (
                <p className="login-helper">
                  Development OTP: <strong>{developmentOtp}</strong>
                </p>
              ) : null}
              {requestError ? <p className="login-error">{requestError}</p> : null}
              {requestSuccess ? <p className="login-success">{requestSuccess}</p> : null}

              <button type="submit" className="login-submit" disabled={resetLoading}>
                {resetLoading ? 'Resetting password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
