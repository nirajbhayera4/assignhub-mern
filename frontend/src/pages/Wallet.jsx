import React, { useState } from 'react';
import '../styles/Wallet.css';

const Wallet = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Earned', amount: 150, description: 'Python Data Analysis Project', date: '2026-03-20' },
    { id: 2, type: 'Withdrawn', amount: 500, description: 'Bank Transfer', date: '2026-03-18' },
    { id: 3, type: 'Earned', amount: 85, description: 'Marketing Strategy Essay', date: '2026-03-15' },
    { id: 4, type: 'Earned', amount: 200, description: 'React.js E-commerce Site (Partial)', date: '2026-03-10' },
    { id: 5, type: 'Earned', amount: 75, description: 'Physics Lab Report', date: '2026-03-08' },
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="wallet-page">
      <div className="wallet-background">
        <div className="wallet-blob wallet-blob-1"></div>
        <div className="wallet-blob wallet-blob-2"></div>
      </div>

      <div className="wallet-container">
        {/* Header */}
        <div className="wallet-header">
          <h1>Wallet & Earnings</h1>
          <p>Manage your funds and track your earnings</p>
        </div>

        {/* Balance Cards */}
        <div className="balance-cards">
          <div className="balance-card-item available">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p>Available Balance</p>
              <h2>$2,450.50</h2>
              <button className="withdraw-btn-card">Withdraw Now</button>
            </div>
          </div>

          <div className="balance-card-item pending">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <p>Pending Earnings</p>
              <h2>$780.00</h2>
              <span className="card-info">From 2 active projects</span>
            </div>
          </div>

          <div className="balance-card-item total">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <p>Total Earned</p>
              <h2>$8,950.50</h2>
              <span className="card-info">All time earnings</span>
            </div>
          </div>

          <div className="balance-card-item withdrawn">
            <div className="card-icon">🏦</div>
            <div className="card-content">
              <p>Total Withdrawn</p>
              <h2>$6,500.00</h2>
              <span className="card-info">To your bank account</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="wallet-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdraw')}
          >
            Withdraw Funds
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content overview-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>💡 Quick Tips</h3>
                <ul>
                  <li>💳 Link your bank account for instant withdrawals</li>
                  <li>📈 Complete more assignments to increase your earnings</li>
                  <li>⭐ Maintain a high rating to attract better paying jobs</li>
                  <li>🔒 Your payment information is securely stored</li>
                </ul>
              </div>

              <div className="overview-card">
                <h3>📅 Payment Schedule</h3>
                <div className="schedule-item">
                  <span className="schedule-label">Payment Processing</span>
                  <p>1-2 business days after withdrawal request</p>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Settlement Time</span>
                  <p>5-7 business days to your bank account</p>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Minimum Withdrawal</span>
                  <p>$10.00 (or currency equivalent)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="tab-content transactions-content">
            <div className="transactions-header">
              <h2>Transaction History</h2>
              <input type="text" placeholder="Search transactions..." className="search-input" />
            </div>

            <div className="transactions-container">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.type === 'Earned' ? '✅' : '💸'}
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.description}</h4>
                    <p>{transaction.date}</p>
                  </div>
                  <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'Earned' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="tab-content withdraw-content">
            <div className="withdraw-form">
              <h2>Withdraw Your Earnings</h2>
              
              <div className="form-section">
                <h3>Step 1: Select Amount</h3>
                <div className="amount-input-wrapper">
                  <span className="currency">$</span>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="amount-input"
                    max="2450.50"
                  />
                </div>
                <p className="available-info">Available to withdraw: $2,450.50</p>
              </div>

              <div className="form-section">
                <h3>Step 2: Select Withdrawal Method</h3>
                <div className="withdrawal-methods">
                  <label className="method-option">
                    <input type="radio" name="method" defaultChecked />
                    <div className="method-info">
                      <span className="method-name">🏦 Bank Transfer</span>
                      <span className="method-desc">5-7 business days</span>
                    </div>
                  </label>
                  <label className="method-option">
                    <input type="radio" name="method" />
                    <div className="method-info">
                      <span className="method-name">💳 Credit Card</span>
                      <span className="method-desc">Instant transfer (fees apply)</span>
                    </div>
                  </label>
                  <label className="method-option">
                    <input type="radio" name="method" />
                    <div className="method-info">
                      <span className="method-name">📱 Digital Wallet</span>
                      <span className="method-desc">1-2 business days</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Step 3: Review & Confirm</h3>
                <div className="review-details">
                  <div className="review-item">
                    <span>Amount:</span>
                    <strong>$ (To be entered)</strong>
                  </div>
                  <div className="review-item">
                    <span>Method:</span>
                    <strong>Bank Transfer</strong>
                  </div>
                  <div className="review-item">
                    <span>Processing Fee:</span>
                    <strong>$0.00</strong>
                  </div>
                  <div className="review-item total">
                    <span>Total to Receive:</span>
                    <strong>$ (To be calculated)</strong>
                  </div>
                </div>

                <button className="withdraw-confirm-btn">Confirm Withdrawal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
