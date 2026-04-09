import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderAssignments } from '../services/assignments';
import { getStoredUser } from '../services/auth';
import { formatCurrencyINR } from '../utils/helpers';
import '../styles/ProviderDashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [postedAssignments, setPostedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviderAssignments();
  }, []);

  const fetchProviderAssignments = async () => {
    try {
      setLoading(true);

      const user = getStoredUser();
      if (user && user._id) {
        const data = await getProviderAssignments(user._id);
        setPostedAssignments(data.assignments || []);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch provider assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPosted = postedAssignments.length;
  const activeAssignments = postedAssignments.filter(
    (assignment) => assignment.status === 'Open' || assignment.status === 'In Progress'
  ).length;
  const completedAssignments = postedAssignments.filter(
    (assignment) => assignment.status === 'Completed'
  ).length;
  const totalSpent = postedAssignments.reduce(
    (sum, assignment) => sum + (Number(assignment.budget) || 0),
    0
  );

  return (
    <div className="provider-dashboard">
      <div className="provider-background">
        <div className="provider-blob provider-blob-1"></div>
        <div className="provider-blob provider-blob-2"></div>
      </div>

      <div className="provider-container">
        {/* Header */}
        <div className="provider-header">
          <div className="header-left">
            <h1>Manage Your Assignments</h1>
            <p>Post, monitor, and manage assignments from verified experts</p>
          </div>
          <button
            className="post-assignment-btn"
            onClick={() => navigate('/post-assignment')}
            type="button"
          >
            + Post New Assignment
          </button>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Total Posted</h3>
            <p className="action-number">{totalPosted}</p>
            <span className="action-meta">All time</span>
          </div>
          <div className="action-card">
            <div className="action-icon">⏳</div>
            <h3>In Progress</h3>
            <p className="action-number">{activeAssignments}</p>
            <span className="action-meta">Being worked on</span>
          </div>
          <div className="action-card">
            <div className="action-icon">✅</div>
            <h3>Completed</h3>
            <p className="action-number">{completedAssignments}</p>
            <span className="action-meta">Delivered</span>
          </div>
          <div className="action-card">
            <div className="action-icon">💰</div>
            <h3>Total Spent</h3>
            <p className="action-number">{formatCurrencyINR(totalSpent)}</p>
            <span className="action-meta">On assignments</span>
          </div>
        </div>

        {/* Posted Assignments */}
        <div className="assignments-section">
          <h2>Your Active Assignments</h2>

          <div className="assignments-list">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading assignments...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchProviderAssignments} className="retry-btn">Retry</button>
              </div>
            ) : postedAssignments.length === 0 ? (
              <div className="empty-state">
                <p>You haven't posted any assignments yet.</p>
                <button
                  onClick={() => navigate('/post-assignment')}
                  className="post-assignment-btn"
                  type="button"
                >
                  Post Your First Assignment
                </button>
              </div>
            ) : (
              postedAssignments.map((assignment) => (
                <div key={assignment._id} className="assignment-item">
                  <div className="item-header">
                    <div className="item-info">
                      <h3>{assignment.title}</h3>
                      <span className={`status-badge ${assignment.status?.toLowerCase().replace(' ', '-') || 'open'}`}>
                        {assignment.status || 'Open'}
                      </span>
                    </div>
                    <div className="item-budget">
                      <span className="budget-label">Budget</span>
                      <p className="budget-amount">{formatCurrencyINR(assignment.budget)}</p>
                    </div>
                  </div>

                  <div className="item-details">
                    <div className="detail-item">
                      <span className="detail-label">Applications</span>
                      <span className="detail-value">{assignment.applications?.length || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Workers Hired</span>
                      <span className="detail-value">{assignment.hiredWorkers?.length || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Due</span>
                      <span className="detail-value">
                        {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'Flexible'}
                      </span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button className="action-btn view-btn">View Details</button>
                    <button className="action-btn manage-btn">Manage Workers</button>
                    <button className="action-btn edit-btn">Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="quick-start">
          <h2>Quick Start</h2>
          <div className="quick-steps">
            <div className="quick-step">
              <div className="step-number">1</div>
              <h4>Post Assignment</h4>
              <p>Create new assignment with details, budget, and deadline</p>
            </div>
            <div className="quick-step">
              <div className="step-number">2</div>
              <h4>Review Applications</h4>
              <p>Browse worker profiles and select the best candidate</p>
            </div>
            <div className="quick-step">
              <div className="step-number">3</div>
              <h4>Monitor Progress</h4>
              <p>Track work progress and communicate with workers</p>
            </div>
            <div className="quick-step">
              <div className="step-number">4</div>
              <h4>Release Payment</h4>
              <p>Review completed work and release payment securely</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
