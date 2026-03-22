import React, { useState, useEffect } from 'react';
import { getWallet, getTransactions, getStoredUser } from '../services/auth';
import '../styles/Wallet.css';

const Wallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    earned: 0,
    pending: 0,
    withdrawn: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      const user = getStoredUser();
      if (user && user._id) {
        // Fetch wallet data
        const walletData = await getWallet(user._id);
        setWallet(walletData);

        // Fetch transactions
        const transactionsData = await getTransactions(user._id);
        setTransactions(transactionsData.transactions || []);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch wallet data:', err);
      setError('Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <h2>${wallet.balance?.toFixed(2) || '0.00'}</h2>
              <button className="withdraw-btn-card">Withdraw Now</button>
            </div>
          </div>

          <div className="balance-card-item pending">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <p>Pending Earnings</p>
              <h2>${wallet.pending?.toFixed(2) || '0.00'}</h2>
              <span className="card-info">From active projects</span>
            </div>
          </div>

          <div className="balance-card-item total">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <p>Total Earned</p>
              <h2>${wallet.earned?.toFixed(2) || '0.00'}</h2>
              <span className="card-info">All time earnings</span>
            </div>
          </div>

          <div className="balance-card-item withdrawn">
            <div className="card-icon">🏦</div>
            <div className="card-content">
              <p>Total Withdrawn</p>
              <h2>${wallet.withdrawn?.toFixed(2) || '0.00'}</h2>
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
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading transactions...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={fetchWalletData} className="retry-btn">Retry</button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions found.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === 'earned' ? '✅' :
                       transaction.type === 'withdrawn' ? '💸' :
                       transaction.type === 'refunded' ? '↩️' : '💰'}
                    </div>
                    <div className="transaction-details">
                      <h4>
                        {transaction.assignment?.title || transaction.description || 'Transaction'}
                      </h4>
                      <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'earned' ? '+' :
                       transaction.type === 'withdrawn' ? '-' :
                       transaction.type === 'refunded' ? '+' : ''}
                      ${transaction.amount?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                ))
              )}
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
                    max={wallet.balance || 0}
                  />
                </div>
                <p className="available-info">Available to withdraw: ${wallet.balance?.toFixed(2) || '0.00'}</p>
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
