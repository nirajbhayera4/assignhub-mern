import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  return (
    <div className="role-selection-page">
      <div className="role-background">
        <div className="gradient-blob gradient-blob-1"></div>
        <div className="gradient-blob gradient-blob-2"></div>
      </div>

      <div className="role-container">
        <h1 className="role-title">Choose Your Path</h1>
        <p className="role-subtitle">Join AssignHub and start making money or finding help</p>

        <div className="role-cards-wrapper">
          <Link to="/register?role=worker" className="role-card worker-card">
            <div className="role-icon">💼</div>
            <h2>Work & Earn Money</h2>
            <p>Complete assignments from students and earn competitive rates</p>
            <ul className="role-features">
              <li>✓ Find assignments in your field</li>
              <li>✓ Set your own rates</li>
              <li>✓ Build your portfolio</li>
              <li>✓ Instant payments</li>
            </ul>
            <button className="role-btn">Create Worker Account</button>
          </Link>

          <Link to="/register?role=provider" className="role-card provider-card">
            <div className="role-icon">📝</div>
            <h2>Post Assignments</h2>
            <p>Post your assignments and get them completed by verified experts</p>
            <ul className="role-features">
              <li>✓ Post unlimited assignments</li>
              <li>✓ Verified workers only</li>
              <li>✓ Quality guaranteed</li>
              <li>✓ Easy payment process</li>
            </ul>
            <button className="role-btn">Create Provider Account</button>
          </Link>
        </div>

        <div className="role-marketplace-link">
          <p>or</p>
          <Link to="/login" className="marketplace-btn">Login to Browse Marketplace</Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
