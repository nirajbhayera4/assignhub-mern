import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your Academic Journey?</h2>
        <p>Join thousands of students getting better grades and experts earning meaningful income. Start today, completely free.</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-white">Get Started Now</Link>
          <Link to="/about" className="btn-secondary" style={{borderColor: 'white', color: 'white'}}>Learn More</Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
