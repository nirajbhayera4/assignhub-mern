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
  category: {
    type: String,
    enum: ['Coding', 'Design', 'Writing', 'Presentation', 'Research', 'Other'],
    default: 'Other'
  },
  assignmentType: {
    type: String,
    enum: ['Homework', 'Project', 'Thesis', 'Exam Prep', 'Presentation', 'Other'],
    default: 'Project'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  pricingType: {
    type: String,
    enum: ['Fixed Price', 'Bidding'],
    default: 'Fixed Price'
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
    min: [1, 'Budget must be at least Rs 1']
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
  estimatedTime: {
    type: String,
    trim: true,
    maxlength: [120, 'Estimated time cannot be more than 120 characters']
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    mimeType: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true
    },
    dataUrl: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  posterSnapshot: {
    name: {
      type: String,
      trim: true
    },
    collegeId: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
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
assignmentSchema.index({ category: 1, pricingType: 1 });
assignmentSchema.index({ provider: 1 });
assignmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
