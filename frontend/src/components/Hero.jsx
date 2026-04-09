import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrencyINR } from '../utils/helpers';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="bg-element bg-1"></div>
      <div className="bg-element bg-2"></div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-eyebrow">Freelance marketplace for assignments, projects, and expert delivery</div>
          <h1>
            Connect. <br />
            Complete. <br />
            <span className="gradient-text">Collaborate.</span>
          </h1>
          <p>Bring together the speed of a freelancing marketplace and the trust signals of an expert network. Post work, compare talent, manage milestones, and get paid securely in one workflow.</p>
          <div className="hero-buttons">
            <Link to="/register?role=provider" className="btn-primary">Hire Talent</Link>
            <Link to="/register?role=worker" className="btn-secondary">Start Earning</Link>
          </div>
          <div className="hero-signals">
            <div className="hero-signal-card">
              <strong>Escrow-style flow</strong>
              <span>Release payment only after approved delivery</span>
            </div>
            <div className="hero-signal-card">
              <strong>Live talent marketplace</strong>
              <span>Blend local assignments with external freelance demand</span>
            </div>
            <div className="hero-signal-card">
              <strong>Fast expert matching</strong>
              <span>Shortlist specialists by budget, speed, and skill</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="card card-1">
              <h3>Essay on AI Ethics</h3>
              <p>10 pages, APA format</p>
              <span className="tag">{formatCurrencyINR(85)}</span>
            </div>
            <div className="card card-2">
              <h3>Calculus Problem Set</h3>
              <p>15 problems with solutions</p>
              <span className="tag">{formatCurrencyINR(45)}</span>
            </div>
            <div className="card card-3">
              <h3>React.js Project</h3>
              <p>Full-stack web application</p>
              <span className="tag">{formatCurrencyINR(150)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
