import React from 'react';
import Footer from '../components/Footer';
import '../styles/InfoPage.css';

const TermsOfService = () => {
  return (
    <div className="info-page">
      <div className="info-shell">
        <div className="info-header">
          <span className="info-kicker">Terms of Service</span>
          <h1>The basic rules for using AssignHub</h1>
          <p>
            These terms describe user responsibilities, acceptable use, and the general
            expectations around platform behavior, job delivery, and account access.
          </p>
        </div>

        <div className="info-card">
          <h2>Account use</h2>
          <p>Users are expected to provide accurate account details and maintain the security of their login credentials.</p>
          <h2>Marketplace conduct</h2>
          <p>Clients and contributors should communicate honestly, deliver work professionally, and avoid spam, fraud, plagiarism, or abuse.</p>
          <h2>Payments and delivery</h2>
          <p>Payment timing, withdrawal processing, and job completion standards may depend on platform workflows and future payment integrations.</p>
          <h2>Platform rights</h2>
          <p>AssignHub may suspend accounts, remove content, or restrict access when activity appears unsafe, misleading, abusive, or harmful to platform integrity.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
