import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrencyINR } from '../utils/helpers';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-eyebrow">Freelance marketplace for assignments, projects, and expert delivery</div>
          <h1>
            Connect. <br />
            Complete. <br />
            <span className="gradient-text">Collaborate.</span>
          </h1>
          <p>Manage assignments, match with verified experts, and finish work faster with a secure, easy-to-use marketplace built for students and specialists.</p>
          <div className="hero-buttons">
            <Link to="/register?role=provider" className="btn-primary">Hire Talent</Link>
            <Link to="/register?role=worker" className="btn-secondary">Start Earning</Link>
          </div>
          <div className="hero-signals">
            <div className="hero-signal-card">
              <strong>Secure payments</strong>
              <span>Release funds only when work is approved.</span>
            </div>
            <div className="hero-signal-card">
              <strong>Quick matching</strong>
              <span>Find the right expert team without the wait.</span>
            </div>
            <div className="hero-signal-card">
              <strong>Clear delivery</strong>
              <span>Track milestones, files, and feedback in one place.</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-cards">
            <div className="visual-card">
              <span className="visual-label">Featured Assignment</span>
              <h3>React.js Project</h3>
              <p>Full-stack web application with polished UI and back-end integration.</p>
              <div className="visual-meta">
                <span>{formatCurrencyINR(150)}</span>
                <span>Fast delivery</span>
              </div>
            </div>
            <div className="visual-card">
              <span className="visual-label">Student favorite</span>
              <h3>Essay on AI Ethics</h3>
              <p>Structured research paper with citations and proofreading.</p>
              <div className="visual-meta">
                <span>{formatCurrencyINR(85)}</span>
                <span>Expert-reviewed</span>
              </div>
            </div>
            <div className="visual-card">
              <span className="visual-label">Quick help</span>
              <h3>Calculus Problem Set</h3>
              <p>Step-by-step solutions with clear explanations.</p>
              <div className="visual-meta">
                <span>{formatCurrencyINR(45)}</span>
                <span>24h turnaround</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
