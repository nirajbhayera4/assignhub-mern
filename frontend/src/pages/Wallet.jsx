import React, { useState, useEffect } from 'react';
import { getStoredUser } from '../services/auth';
import { getWallet, getTransactions, processWithdrawal } from '../services/users';
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
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setWallet(walletData.wallet || {
          balance: 0,
          earned: 0,
          pending: 0,
          withdrawn: 0
        });

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

  const handleWithdraw = async () => {
    const user = getStoredUser();
    const numericAmount = Number(withdrawAmount);

    if (!user?._id) {
      setWithdrawError('Please log in again to continue.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setWithdrawError('Enter a valid withdrawal amount.');
      return;
    }

    if (numericAmount > (wallet.balance || 0)) {
      setWithdrawError('Withdrawal amount cannot exceed your available balance.');
      return;
    }

    if (!upiId.trim()) {
      setWithdrawError('Enter your UPI ID.');
      return;
    }

    try {
      setIsSubmitting(true);
      setWithdrawError('');
      setWithdrawSuccess('');

      await processWithdrawal(user._id, {
        amount: numericAmount,
        paymentMethod: 'upi',
        upiId: upiId.trim()
      });

      setWithdrawSuccess('UPI withdrawal request submitted successfully.');
      setWithdrawAmount('');
      setUpiId('');
      await fetchWalletData();
      setActiveTab('transactions');
    } catch (err) {
      setWithdrawError(
        err.response?.data?.message || 'Failed to submit withdrawal request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedWithdrawAmount = withdrawAmount && Number(withdrawAmount) > 0
    ? Number(withdrawAmount).toFixed(2)
    : '0.00';

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
              <button
                className="withdraw-btn-card"
                onClick={() => setActiveTab('withdraw')}
                type="button"
              >
                Withdraw via UPI
              </button>
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
              <span className="card-info">To your linked UPI ID</span>
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
                  <li>📱 Use your UPI ID for faster withdrawals</li>
                  <li>📈 Complete more assignments to increase your earnings</li>
                  <li>⭐ Maintain a high rating to attract better paying jobs</li>
                  <li>🔒 Your payment information is securely stored</li>
                </ul>
              </div>

              <div className="overview-card">
                <h3>📅 Payment Schedule</h3>
                <div className="schedule-item">
                  <span className="schedule-label">Payment Processing</span>
                  <p>Within 24 hours after withdrawal request</p>
                </div>
                <div className="schedule-item">
                  <span className="schedule-label">Settlement Time</span>
                  <p>Usually instant to your UPI app or bank</p>
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
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                    max={wallet.balance || 0}
                  />
                </div>
                <p className="available-info">Available to withdraw: ${wallet.balance?.toFixed(2) || '0.00'}</p>
              </div>

              <div className="form-section">
                <h3>Step 2: Select Withdrawal Method</h3>
                <div className="withdrawal-methods">
                  <label className="method-option selected">
                    <input type="radio" name="method" checked readOnly />
                    <div className="method-info">
                      <span className="method-name">📱 UPI</span>
                      <span className="method-desc">Primary payout method for this wallet</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Step 3: Enter UPI ID</h3>
                <input
                  type="text"
                  placeholder="yourname@bank"
                  className="upi-input"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                />
                <p className="available-info">Example: alex@okaxis or name@paytm</p>
              </div>

              <div className="form-section">
                <h3>Step 4: Review & Confirm</h3>
                {withdrawError ? <p className="withdraw-message withdraw-error">{withdrawError}</p> : null}
                {withdrawSuccess ? <p className="withdraw-message withdraw-success">{withdrawSuccess}</p> : null}
                <div className="review-details">
                  <div className="review-item">
                    <span>Amount:</span>
                    <strong>${formattedWithdrawAmount}</strong>
                  </div>
                  <div className="review-item">
                    <span>Method:</span>
                    <strong>UPI</strong>
                  </div>
                  <div className="review-item">
                    <span>UPI ID:</span>
                    <strong>{upiId.trim() || 'Not entered yet'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Processing Fee:</span>
                    <strong>$0.00</strong>
                  </div>
                  <div className="review-item total">
                    <span>Total to Receive:</span>
                    <strong>${formattedWithdrawAmount}</strong>
                  </div>
                </div>

                <button
                  className="withdraw-confirm-btn"
                  onClick={handleWithdraw}
                  disabled={isSubmitting}
                  type="button"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm UPI Withdrawal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
