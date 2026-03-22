import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  useEffect(() => {
    // Animate container
    gsap.from('.role-container', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate role cards
    gsap.from('.role-card', {
      opacity: 0,
      y: 100,
      duration: 0.8,
      delay: 0.2,
      stagger: 0.3,
      ease: 'power3.out'
    });

    // Hover animation for role cards
    document.querySelectorAll('.role-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -20,
          boxShadow: '0 30px 60px rgba(0, 255, 136, 0.3)',
          duration: 0.3
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          duration: 0.3
        });
      });
    });
  }, []);

  return (
    <div className="role-selection-page">
      <div className="role-background">
        <div className="gradient-blob gradient-blob-1"></div>
        <div className="gradient-blob gradient-blob-2"></div>
      </div>

      <div className="role-container">
        <h1 className="role-title">Choose Your Path</h1>
        <p className="role-subtitle">Join AssignHub and start making money or finding help</p>

        <div className="role-cards-wrapper">
          <Link to="/worker-dashboard" className="role-card worker-card">
            <div className="role-icon">💼</div>
            <h2>Work & Earn Money</h2>
            <p>Complete assignments from students and earn competitive rates</p>
            <ul className="role-features">
              <li>✓ Find assignments in your field</li>
              <li>✓ Set your own rates</li>
              <li>✓ Build your portfolio</li>
              <li>✓ Instant payments</li>
            </ul>
            <button className="role-btn">Get Started as Worker</button>
          </Link>

          <Link to="/provider-dashboard" className="role-card provider-card">
            <div className="role-icon">📝</div>
            <h2>Post Assignments</h2>
            <p>Post your assignments and get them completed by verified experts</p>
            <ul className="role-features">
              <li>✓ Post unlimited assignments</li>
              <li>✓ Verified workers only</li>
              <li>✓ Quality guaranteed</li>
              <li>✓ Easy payment process</li>
            </ul>
            <button className="role-btn">Post Assignment</button>
          </Link>
        </div>

        <div className="role-marketplace-link">
          <p>or</p>
          <Link to="/marketplace" className="marketplace-btn">Browse Marketplace</Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
