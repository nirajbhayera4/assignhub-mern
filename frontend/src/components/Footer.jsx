import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <h3>AssignHub</h3>
          <p>Empowering students and experts to collaborate, learn, and succeed together. Building the future of academic support.</p>
        </div>
        <div className="footer-links">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/role-selection">For Students</Link></li>
            <li><Link to="/register?role=worker">For Experts</Link></li>
            <li><Link to="/home">How It Works</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/profile">Your Profile</Link></li>
            <li><Link to="/provider-dashboard">Post Work</Link></li>
            <li><Link to="/wallet">Wallet</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/about">Privacy Policy</Link></li>
            <li><Link to="/about">Terms of Service</Link></li>
            <li><Link to="/about">Cookie Policy</Link></li>
            <li><Link to="/about">Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AssignHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
