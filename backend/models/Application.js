const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assignment',
    required: true
  },
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  proposedBudget: {
    type: Number,
    min: [1, 'Proposal budget must be at least 1']
  },
  estimatedTime: {
    type: String,
    maxlength: [120, 'Estimated time cannot be more than 120 characters']
  },
  proposalMessage: {
    type: String,
    maxlength: [1000, 'Proposal message cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date
});

// Prevent duplicate applications
applicationSchema.index({ assignment: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
