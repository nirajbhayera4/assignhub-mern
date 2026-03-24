import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredUser, isAuthenticated, logout } from '../services/auth';
import '../styles/Navigation.css';

const Navigation = ({ userRole, setUserRole }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const authenticated = isAuthenticated();
  const storedUser = getStoredUser();
  const walletBalance = storedUser?.wallet?.balance || 0;

  return (
    <nav className="marketplace-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Assign<span>Hub</span>
        </Link>

        <div className="nav-links">
          <Link to="/marketplace" className="nav-item">
            🛒 Marketplace
          </Link>
          <Link to="/worker-dashboard" className="nav-item">
            💼 Worker Dashboard
          </Link>
          <Link to="/provider-dashboard" className="nav-item">
            📝 Post Assignment
          </Link>
        </div>

        <div className="nav-right">
          {authenticated ? (
            <>
              <Link to="/wallet" className="wallet-indicator">
                <span className="wallet-icon">💰</span>
                <span className="wallet-amount">${walletBalance.toFixed(2)}</span>
              </Link>

              <div className="role-switcher">
                <button
                  className="role-toggle-btn"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                >
                  <span className="role-icon">
                    {userRole === 'worker' ? '👨‍💼' : '📚'}
                  </span>
                  <span className="role-text">
                    {userRole === 'worker' ? 'Worker' : 'Provider'}
                  </span>
                  <span className="toggle-arrow">▼</span>
                </button>

                {showRoleMenu && (
                  <div className="role-dropdown-menu">
                    <button
                      className={`role-option ${userRole === 'worker' ? 'active' : ''}`}
                      onClick={() => {
                        setUserRole('worker');
                        setShowRoleMenu(false);
                      }}
                    >
                      <span className="role-option-icon">👨‍💼</span>
                      <div className="role-option-text">
                        <p className="role-option-title">Work & Earn</p>
                        <p className="role-option-desc">Complete assignments</p>
                      </div>
                    </button>
                    <button
                      className={`role-option ${userRole === 'provider' ? 'active' : ''}`}
                      onClick={() => {
                        setUserRole('provider');
                        setShowRoleMenu(false);
                      }}
                    >
                      <span className="role-option-icon">📚</span>
                      <div className="role-option-text">
                        <p className="role-option-title">Provider</p>
                        <p className="role-option-desc">Post assignments</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className="nav-profile-stack">
                <Link to="/profile" className="nav-profile-btn">
                  {storedUser?.avatar ? (
                    <img
                      src={storedUser.avatar}
                      alt={storedUser?.name || 'Profile'}
                      className="nav-profile-image"
                    />
                  ) : (
                    storedUser?.name?.charAt(0)?.toUpperCase() || '👤'
                  )}
                </Link>
                <button className="nav-logout-btn" onClick={logout} type="button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="cta-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
