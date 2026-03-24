import React from 'react';
import Footer from '../components/Footer';
import '../styles/InfoPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="info-page">
      <div className="info-shell">
        <div className="info-header">
          <span className="info-kicker">Privacy Policy</span>
          <h1>How AssignHub handles user information</h1>
          <p>
            This page explains the types of account, profile, and marketplace data we
            collect so the platform can function, personalize your experience, and keep
            the service secure.
          </p>
        </div>

        <div className="info-card">
          <h2>Information we collect</h2>
          <p>We collect account information such as your name, email address, role, profile details, wallet activity, and platform interactions.</p>
          <h2>How we use it</h2>
          <p>We use this information to authenticate users, manage profiles, process marketplace activity, improve product quality, and support communication across the platform.</p>
          <h2>Data sharing</h2>
          <p>AssignHub does not aim to sell personal data. Data may be shared with service providers that support hosting, email delivery, analytics, or payment-related workflows.</p>
          <h2>Your control</h2>
          <p>You can update your profile information inside the app. If you need broader account support or deletion help, contact the AssignHub team.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
