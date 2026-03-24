import React from 'react';
import Footer from '../components/Footer';
import '../styles/InfoPage.css';

const Contact = () => {
  return (
    <div className="info-page">
      <div className="info-shell">
        <div className="info-header">
          <span className="info-kicker">Contact</span>
          <h1>Reach the AssignHub team</h1>
          <p>
            Use these contact details for support, partnership questions, user issues,
            or product feedback as the platform grows.
          </p>
        </div>

        <div className="info-card info-grid">
          <div>
            <h2>Email</h2>
            <p>support@assignhub.app</p>
          </div>
          <div>
            <h2>Business</h2>
            <p>partnerships@assignhub.app</p>
          </div>
          <div>
            <h2>Response time</h2>
            <p>Usually within 1 to 2 business days</p>
          </div>
          <div>
            <h2>Use cases</h2>
            <p>Account help, marketplace issues, profile concerns, and feature feedback</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
