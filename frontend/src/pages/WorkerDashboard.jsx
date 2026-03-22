import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/WorkerDashboard.css';

gsap.registerPlugin(ScrollTrigger);

const WorkerDashboard = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Python Data Analysis Project',
      subject: 'Programming',
      description: 'Create a comprehensive data analysis report using Python',
      budget: 150,
      deadline: '5 days',
      difficulty: 'Medium',
      workers: 3
    },
    {
      id: 2,
      title: 'Marketing Strategy Essay',
      subject: 'Business',
      description: 'Write a 5000-word essay on digital marketing strategies',
      budget: 85,
      deadline: '7 days',
      difficulty: 'Easy',
      workers: 5
    },
    {
      id: 3,
      title: 'React.js E-commerce Site',
      subject: 'Web Development',
      description: 'Build a full-stack e-commerce platform with payment integration',
      budget: 500,
      deadline: '14 days',
      difficulty: 'Hard',
      workers: 2
    },
    {
      id: 4,
      title: 'Physics Lab Report',
      subject: 'Science',
      description: 'Complete lab experiment and write detailed findings',
      budget: 75,
      deadline: '3 days',
      difficulty: 'Medium',
      workers: 4
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Animate header
    gsap.from('.worker-header', {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate stats
    gsap.from('.stat-card', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.2,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Animate filter buttons
    gsap.from('.filter-btn', {
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Animate assignment cards on scroll
    gsap.from('.assignment-card', {
      scrollTrigger: {
        trigger: '.assignments-container',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 100,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Hover animation for assignment cards
    document.querySelectorAll('.assignment-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          boxShadow: '0 25px 60px rgba(0, 255, 136, 0.2)',
          duration: 0.3
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          duration: 0.3
        });
      });
    });
  }, []);

  return (
    <div className="worker-dashboard">
      <div className="worker-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="worker-container">
        {/* Header */}
        <div className="worker-header">
          <div className="header-content">
            <h1>Available Assignments</h1>
            <p>Browse and apply for assignments to earn money</p>
          </div>
          <div className="header-balance">
            <div className="balance-card">
              <p>Current Balance</p>
              <h2>$2,450.50</h2>
              <button className="withdraw-btn">Withdraw Funds</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <p>Total Earned</p>
              <h3>$2,450.50</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-info">
              <p>Completed</p>
              <h3>12</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <p>Rating</p>
              <h3>4.9/5.0</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <p>In Progress</p>
              <h3>2</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Assignments
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'easy' ? 'active' : ''}`}
            onClick={() => setActiveFilter('easy')}
          >
            Easy
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'medium' ? 'active' : ''}`}
            onClick={() => setActiveFilter('medium')}
          >
            Medium
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'hard' ? 'active' : ''}`}
            onClick={() => setActiveFilter('hard')}
          >
            Hard
          </button>
          <div className="filter-search">
            <input type="text" placeholder="Search assignments..." />
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="assignments-container">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="card-header">
                <span className={`difficulty ${assignment.difficulty.toLowerCase()}`}>
                  {assignment.difficulty}
                </span>
                <span className="subject-tag">{assignment.subject}</span>
              </div>

              <h3 className="assignment-title">{assignment.title}</h3>
              <p className="assignment-description">{assignment.description}</p>

              <div className="assignment-meta">
                <div className="meta-item">
                  <span className="meta-icon">💰</span>
                  <span>${assignment.budget}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱</span>
                  <span>{assignment.deadline}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">👥</span>
                  <span>{assignment.workers} workers</span>
                </div>
              </div>

              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
