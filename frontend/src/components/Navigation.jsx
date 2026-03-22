import React from 'react';
import '../styles/Navigation.css';

const Navigation = () => {
  return (
    <nav>
      <div className="logo">
        Assign<span>Hub</span>
      </div>
      <div className="nav-links">
        <a href="#how">How It Works</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#" className="cta-btn">Get Started</a>
      </div>
    </nav>
  );
};

export default Navigation;