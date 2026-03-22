const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [1, 'Budget must be at least $1']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  maxWorkers: {
    type: Number,
    default: 1,
    min: [1, 'Must have at least 1 worker']
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  applications: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  }],
  hiredWorkers: [{
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    hiredAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better query performance
assignmentSchema.index({ subject: 1, difficulty: 1, status: 1 });
assignmentSchema.index({ provider: 1 });
assignmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
