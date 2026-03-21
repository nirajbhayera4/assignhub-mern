import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how">
      <div className="section-title">
        <h2>How It Works</h2>
        <p>Simple, transparent, and efficient</p>
      </div>
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Post Your Assignment</h3>
            <p>Students upload their assignment details, requirements, deadlines, and budget. Our smart matching algorithm immediately starts connecting you with qualified experts in your subject area.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Get Matched with Experts</h3>
            <p>Browse profiles, reviews, and pricing from verified experts. Chat directly, ask questions, and choose the perfect helper based on expertise, ratings, and availability.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Track Progress & Collaborate</h3>
            <p>Real-time updates, milestone tracking, and direct communication ensure you're always in the loop. Request revisions, provide feedback, and collaborate seamlessly.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Receive & Review</h3>
            <p>Get your completed assignment, review the work, and release payment securely through our escrow system. Rate your experience and build your academic network.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;