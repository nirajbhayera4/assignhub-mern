import React, { useState } from 'react';
import '../styles/ProviderDashboard.css';

const ProviderDashboard = () => {
  const [postedAssignments, setPostedAssignments] = useState([
    {
      id: 1,
      title: 'UI/UX Design Project',
      status: 'In Progress',
      budget: 250,
      applications: 5,
      completionDate: '2026-04-15',
      workers: 1
    },
    {
      id: 2,
      title: 'SEO Optimization Report',
      status: 'Completed',
      budget: 120,
      applications: 8,
      completionDate: '2026-03-20',
      workers: 1
    },
    {
      id: 3,
      title: 'Database Architecture Setup',
      status: 'Pending',
      budget: 350,
      applications: 3,
      completionDate: '2026-05-01',
      workers: 0
    }
  ]);

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
          <button className="post-assignment-btn">+ Post New Assignment</button>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Total Posted</h3>
            <p className="action-number">24</p>
            <span className="action-meta">All time</span>
          </div>
          <div className="action-card">
            <div className="action-icon">⏳</div>
            <h3>In Progress</h3>
            <p className="action-number">3</p>
            <span className="action-meta">Being worked on</span>
          </div>
          <div className="action-card">
            <div className="action-icon">✅</div>
            <h3>Completed</h3>
            <p className="action-number">18</p>
            <span className="action-meta">Delivered</span>
          </div>
          <div className="action-card">
            <div className="action-icon">💰</div>
            <h3>Total Spent</h3>
            <p className="action-number">$3,250</p>
            <span className="action-meta">On assignments</span>
          </div>
        </div>

        {/* Posted Assignments */}
        <div className="assignments-section">
          <h2>Your Active Assignments</h2>
          
          <div className="assignments-list">
            {postedAssignments.map((assignment) => (
              <div key={assignment.id} className="assignment-item">
                <div className="item-header">
                  <div className="item-info">
                    <h3>{assignment.title}</h3>
                    <span className={`status-badge ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="item-budget">
                    <span className="budget-label">Budget</span>
                    <p className="budget-amount">${assignment.budget}</p>
                  </div>
                </div>

                <div className="item-details">
                  <div className="detail-item">
                    <span className="detail-label">Applications</span>
                    <span className="detail-value">{assignment.applications}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Workers Hired</span>
                    <span className="detail-value">{assignment.workers}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Due</span>
                    <span className="detail-value">{assignment.completionDate}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <button className="action-btn view-btn">View Details</button>
                  <button className="action-btn manage-btn">Manage Workers</button>
                  <button className="action-btn edit-btn">Edit</button>
                </div>
              </div>
            ))}
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
