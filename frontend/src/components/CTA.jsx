import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your Academic Journey?</h2>
        <p>Join thousands of students getting better grades and experts earning meaningful income. Start today, completely free.</p>
        <div className="cta-buttons">
          <a href="#" className="btn-white">Get Started Now</a>
          <a href="#" className="btn-secondary" style={{borderColor: 'white', color: 'white'}}>Learn More</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;