const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user wallet
// @route   GET /api/users/:id/wallet
// @access  Private
exports.getUserWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Make sure user can only access their own wallet
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this wallet'
      });
    }

    // Get recent transactions
    const transactions = await Transaction.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        wallet: user.wallet,
        recentTransactions: transactions
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/users/:id/transactions
// @access  Private
exports.getUserTransactions = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Make sure user can only access their own transactions
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these transactions'
      });
    }

    const transactions = await Transaction.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate('assignment', 'title');

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Process withdrawal
// @route   POST /api/users/:id/withdraw
// @access  Private
exports.processWithdrawal = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Make sure user can only withdraw from their own wallet
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to withdraw from this wallet'
      });
    }

    const { amount, paymentMethod } = req.body;

    if (amount > user.wallet.balance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'withdrawn',
      amount,
      description: `Withdrawal via ${paymentMethod}`,
      status: 'pending',
      paymentMethod
    });

    // Update user wallet
    user.updateWallet(amount, 'withdraw');
    await user.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
