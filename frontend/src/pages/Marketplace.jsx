import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Marketplace.css';

gsap.registerPlugin(ScrollTrigger);

const Marketplace = () => {
  const [assignments] = useState([
    {
      id: 1,
      title: 'Machine Learning Model Development',
      category: 'AI/ML',
      budget: 500,
      difficulty: 'Hard',
      deadline: '14 days',
      postedBy: 'John Doe',
      rating: 4.8,
      applications: 3
    },
    {
      id: 2,
      title: 'WordPress Blog Setup',
      category: 'Web Development',
      budget: 150,
      difficulty: 'Easy',
      deadline: '3 days',
      postedBy: 'Jane Smith',
      rating: 4.9,
      applications: 7
    },
    {
      id: 3,
      title: 'Mobile App UI Design',
      category: 'Design',
      budget: 300,
      difficulty: 'Medium',
      deadline: '7 days',
      postedBy: 'Alex Johnson',
      rating: 4.7,
      applications: 5
    },
    {
      id: 4,
      title: 'Content Writing - 20 Blog Posts',
      category: 'Writing',
      budget: 400,
      difficulty: 'Easy',
      deadline: '21 days',
      postedBy: 'Sarah Williams',
      rating: 4.9,
      applications: 12
    },
    {
      id: 5,
      title: 'Data Analysis Report',
      category: 'Data Science',
      budget: 250,
      difficulty: 'Medium',
      deadline: '10 days',
      postedBy: 'Mike Brown',
      rating: 4.6,
      applications: 4
    },
    {
      id: 6,
      title: 'E-commerce Platform Development',
      category: 'Web Development',
      budget: 800,
      difficulty: 'Hard',
      deadline: '30 days',
      postedBy: 'Emily Davis',
      rating: 5.0,
      applications: 2
    },
  ]);

  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Animate header
    gsap.from('.marketplace-header', {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate filter section
    gsap.from('.marketplace-filters', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    });

    // Animate assignment items
    gsap.from('.marketplace-card', {
      scrollTrigger: {
        trigger: '.marketplace-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 100,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Hover effects
    document.querySelectorAll('.marketplace-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          boxShadow: '0 30px 60px rgba(0, 255, 136, 0.2)',
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
    <div className="marketplace-page">
      <div className="marketplace-background">
        <div className="market-blob market-blob-1"></div>
        <div className="market-blob market-blob-2"></div>
      </div>

      <div className="marketplace-container">
        {/* Header */}
        <div className="marketplace-header">
          <h1>Explore Marketplace</h1>
          <p>Discover thousands of assignments waiting to be completed</p>
        </div>

        {/* Filters */}
        <div className="marketplace-filters">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="data">Data Science</option>
              <option value="ai">AI/ML</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Budget Range</label>
            <select className="filter-select">
              <option>All Budgets</option>
              <option>$0 - $100</option>
              <option>$100 - $300</option>
              <option>$300 - $500</option>
              <option>$500+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select className="filter-select">
              <option>All Levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Budget</option>
              <option value="deadline">Earliest Deadline</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="marketplace-grid">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="marketplace-card">
              <div className="card-badge">
                <span className={`badge-category ${assignment.category.toLowerCase().replace(/\//g, '-')}`}>
                  {assignment.category}
                </span>
                <span className={`badge-difficulty ${assignment.difficulty.toLowerCase()}`}>
                  {assignment.difficulty}
                </span>
              </div>

              <h3 className="card-title">{assignment.title}</h3>
              
              <div className="card-meta">
                <span className="meta-item">👤 {assignment.postedBy}</span>
                <span className="meta-item">⭐ {assignment.rating}</span>
              </div>

              <div className="card-details">
                <div className="detail-box">
                  <p className="detail-label">Budget</p>
                  <p className="detail-value">${assignment.budget}</p>
                </div>
                <div className="detail-box">
                  <p className="detail-label">Timeline</p>
                  <p className="detail-value">{assignment.deadline}</p>
                </div>
                <div className="detail-box">
                  <p className="detail-label">Applications</p>
                  <p className="detail-value">{assignment.applications}</p>
                </div>
              </div>

              <button className="view-details-btn">View Details & Apply</button>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="load-more">
          <button className="load-more-btn">Load More Assignments</button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
