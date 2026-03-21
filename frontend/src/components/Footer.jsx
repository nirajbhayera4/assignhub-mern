import React from 'react';
import './Footer.css';

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
            <li><a href="#">For Students</a></li>
            <li><a href="#">For Experts</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Guidelines</a></li>
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