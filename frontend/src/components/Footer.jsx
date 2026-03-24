import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <h3>AssignHub</h3>
          <p>Empowering students, specialists, and clients to connect through a cleaner marketplace for real projects, stronger profiles, and practical earnings.</p>
          <div className="footer-contact-pills">
            <span>support@assignhub.app</span>
            <span>Remote-first platform</span>
          </div>
        </div>
        <div className="footer-links">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/role-selection">For Students</Link></li>
            <li><Link to="/register?role=worker">For Experts</Link></li>
            <li><Link to="/home">How It Works</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/register?role=provider">Hire Talent</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/profile">Your Profile</Link></li>
            <li><Link to="/provider-dashboard">Post Work</Link></li>
            <li><Link to="/wallet">Wallet</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/home">Features</Link></li>
            <li><Link to="/marketplace">Live Jobs</Link></li>
            <li><Link to="/about">Mission</Link></li>
            <li><Link to="/contact">Support</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            <li><Link to="/guidelines">Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AssignHub. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/about">About</Link>
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-of-service">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
