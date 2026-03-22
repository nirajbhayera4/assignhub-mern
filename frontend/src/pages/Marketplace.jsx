import React, { useState, useEffect } from 'react';
import { getAssignments } from '../services/assignments';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [sortBy, filterCategory]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = {};

      // Add sorting
      if (sortBy === 'highest') {
        params.sort = '-budget';
      } else if (sortBy === 'deadline') {
        params.sort = 'deadline';
      } else if (sortBy === 'popular') {
        params.sort = '-applications';
      } else {
        params.sort = '-createdAt'; // recent
      }

      // Add category filter
      if (filterCategory !== 'all') {
        params.subject = filterCategory;
      }

      const data = await getAssignments(params);
      setAssignments(data.assignments || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
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

        {/* Search Bar */}
        <div className="marketplace-search">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Assignments Grid */}
        <div className="marketplace-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchAssignments} className="retry-btn">Retry</button>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <p>No assignments found matching your criteria.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div key={assignment._id} className="marketplace-card">
                <div className="card-badge">
                  <span className={`badge-category ${assignment.subject?.toLowerCase().replace(/\//g, '-') || 'general'}`}>
                    {assignment.subject || 'General'}
                  </span>
                  <span className={`badge-difficulty ${assignment.difficulty?.toLowerCase() || 'medium'}`}>
                    {assignment.difficulty || 'Medium'}
                  </span>
                </div>

                <h3 className="card-title">{assignment.title}</h3>

                <div className="card-meta">
                  <span className="meta-item">👤 {assignment.provider?.name || 'Anonymous'}</span>
                  <span className="meta-item">⭐ {assignment.provider?.rating || '4.5'}</span>
                </div>

                <div className="card-details">
                  <div className="detail-box">
                    <p className="detail-label">Budget</p>
                    <p className="detail-value">${assignment.budget}</p>
                  </div>
                  <div className="detail-box">
                    <p className="detail-label">Timeline</p>
                    <p className="detail-value">
                      {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'Flexible'}
                    </p>
                  </div>
                  <div className="detail-box">
                    <p className="detail-label">Applications</p>
                    <p className="detail-value">{assignment.applications?.length || 0}</p>
                  </div>
                </div>

                <button className="view-details-btn">View Details & Apply</button>
              </div>
            ))
          )}
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
