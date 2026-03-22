import React from 'react';
import '../styles/Features.css';

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="section-title">
        <h2>Why Choose AssignHub?</h2>
        <p>Built for students, powered by experts</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payments</h3>
          <p>Your money is protected with our escrow system. Payment is only released when you're 100% satisfied with the work delivered.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Matching</h3>
          <p>Get connected with qualified experts in minutes, not hours. Our AI-powered system ensures the perfect match every time.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✓</div>
          <h3>Verified Experts</h3>
          <p>Every helper goes through rigorous verification. Check credentials, ratings, and past work before making your choice.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Real-Time Chat</h3>
          <p>Communicate instantly with your expert. Share files, ask questions, and get updates throughout the entire process.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Quality Guarantee</h3>
          <p>Not satisfied? Request unlimited revisions. We stand behind the quality of work delivered on our platform.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Progress Tracking</h3>
          <p>Stay informed with milestone updates, delivery estimates, and real-time progress indicators for all your assignments.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;