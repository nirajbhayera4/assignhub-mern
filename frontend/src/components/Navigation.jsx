import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ userRole, setUserRole }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

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
          {/* Wallet */}
          <Link to="/wallet" className="wallet-indicator">
            <span className="wallet-icon">💰</span>
            <span className="wallet-amount">$2,450.50</span>
          </Link>

          {/* Role Switcher */}
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

          {/* Profile */}
          <button className="nav-profile-btn">👤</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;