import React from 'react';
import Footer from '../components/Footer';
import '../styles/InfoPage.css';

const CookiePolicy = () => {
  return (
    <div className="info-page">
      <div className="info-shell">
        <div className="info-header">
          <span className="info-kicker">Cookie Policy</span>
          <h1>How browser storage supports the product</h1>
          <p>
            AssignHub may use local browser storage and similar technologies to keep you
            signed in, remember settings, and improve site performance.
          </p>
        </div>

        <div className="info-card">
          <h2>Essential storage</h2>
          <p>Core storage helps keep authentication sessions, user context, and app preferences working as expected.</p>
          <h2>Experience improvements</h2>
          <p>We may use storage to remember saved listings, profile state, or interface preferences that make the experience smoother.</p>
          <h2>Your choice</h2>
          <p>You can clear browser storage through your browser settings, though doing so may sign you out or remove saved preferences.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
