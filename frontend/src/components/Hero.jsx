import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="bg-element bg-1"></div>
      <div className="bg-element bg-2"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Connect. <br />
            Complete. <br />
            <span className="gradient-text">Collaborate.</span>
          </h1>
          <p>The smartest way to get your assignments done. Students find help, experts earn money. Welcome to the future of academic collaboration.</p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">I Need Help</a>
            <a href="#" className="btn-secondary">I Want to Earn</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="card card-1">
              <h3>Essay on AI Ethics</h3>
              <p>10 pages, APA format</p>
              <span className="tag">$85.00</span>
            </div>
            <div className="card card-2">
              <h3>Calculus Problem Set</h3>
              <p>15 problems with solutions</p>
              <span className="tag">$45.00</span>
            </div>
            <div className="card card-3">
              <h3>React.js Project</h3>
              <p>Full-stack web application</p>
              <span className="tag">$150.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;