import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-container">
        <div className="stat-item">
          <h2 className="stat-number">12K+</h2>
          <p>Assignments Completed</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number">5K+</h2>
          <p>Active Students</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number">2K+</h2>
          <p>Expert Helpers</p>
        </div>
        <div className="stat-item">
          <h2 className="stat-number">98%</h2>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;