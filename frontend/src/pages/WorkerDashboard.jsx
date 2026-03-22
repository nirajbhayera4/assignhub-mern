import React, { useState, useEffect } from 'react';
import { getAssignments } from '../services/assignments';
import { getStoredUser } from '../services/auth';
import { getWallet } from '../services/users';
import '../styles/WorkerDashboard.css';

const WorkerDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [wallet, setWallet] = useState({
    balance: 0,
    earned: 0,
    pending: 0,
    withdrawn: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch assignments
      const assignmentsData = await getAssignments();
      setAssignments(assignmentsData.assignments || []);

      // Fetch wallet data
      const user = getStoredUser();
      if (user && user._id) {
        const walletData = await getWallet(user._id);
        setWallet(walletData);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return assignment.status === 'Open';
    if (activeFilter === 'applied') return assignment.applications?.some(app => app.worker === getStoredUser()?._id);

    return assignment.difficulty?.toLowerCase() === activeFilter;
  });

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
              <h2>${wallet.balance?.toFixed(2) || '0.00'}</h2>
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
              <h3>${wallet.earned?.toFixed(2) || '0.00'}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <p>Pending</p>
              <h3>${wallet.pending?.toFixed(2) || '0.00'}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p>Withdrawn</p>
              <h3>${wallet.withdrawn?.toFixed(2) || '0.00'}</h3>
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
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <p>No assignments found matching your criteria.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="card-header">
                  <span className={`difficulty ${assignment.difficulty?.toLowerCase() || 'medium'}`}>
                    {assignment.difficulty || 'Medium'}
                  </span>
                  <span className="subject-tag">{assignment.subject || 'General'}</span>
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
                    <span>
                      {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'Flexible'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>{assignment.applications?.length || 0} applicants</span>
                  </div>
                </div>

                <button className="apply-btn">Apply Now</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
