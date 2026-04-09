const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['worker', 'provider'],
    required: [true, 'Please specify a role']
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  collegeId: {
    type: String,
    trim: true,
    maxlength: [40, 'College ID cannot be more than 40 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // Wallet information
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    totalWithdrawn: {
      type: Number,
      default: 0
    },
    pendingBalance: {
      type: Number,
      default: 0
    }
  },
  // Provider stats
  providerStats: {
    totalPosted: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    activeAssignments: {
      type: Number,
      default: 0
    }
  },
  // Worker stats
  workerStats: {
    assignmentsCompleted: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    activeAssignments: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  resetPasswordOtp: String,
  resetPasswordOtpExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatePasswordResetOtp = function() {
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

  this.resetPasswordOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  this.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

// Update wallet balance
userSchema.methods.updateWallet = function(amount, type) {
  if (type === 'earn') {
    this.wallet.balance += amount;
    this.wallet.totalEarned += amount;
    if (this.role === 'worker') {
      this.workerStats.totalEarned += amount;
    }
  } else if (type === 'withdraw') {
    this.wallet.balance -= amount;
    this.wallet.totalWithdrawn += amount;
  } else if (type === 'spend') {
    this.wallet.balance -= amount;
    if (this.role === 'provider') {
      this.providerStats.totalSpent += amount;
    }
  }
};

module.exports = mongoose.model('User', userSchema);
