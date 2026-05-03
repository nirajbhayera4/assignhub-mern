const Assignment = require('../models/Assignment');
const Application = require('../models/Application');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const {
  fetchAdzunaMarketplaceAssignments,
} = require('../services/adzunaMarketplaceService');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
exports.getAssignments = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Assignment.find(JSON.parse(queryStr)).populate({
    path: 'provider',
    select: 'name rating totalReviews'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Assignment.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const assignments = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: assignments.length,
    pagination,
    data: assignments
  });
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Public
exports.getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate({
      path: 'provider',
      select: 'name email rating totalReviews bio'
    })
    .populate({
      path: 'applications',
      populate: {
        path: 'worker',
        select: 'name rating totalReviews skills'
      }
    });

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }

  res.status(200).json({
    success: true,
    data: assignment
  });
});

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Provider only)
exports.createAssignment = asyncHandler(async (req, res, next) => {
  const skillsRequired = Array.isArray(req.body.skillsRequired)
    ? req.body.skillsRequired
    : typeof req.body.skillsRequired === 'string'
      ? req.body.skillsRequired.split(',').map((skill) => skill.trim()).filter(Boolean)
      : [];

  const attachments = Array.isArray(req.body.attachments)
    ? req.body.attachments
        .filter((file) => file?.name && file?.mimeType && file?.dataUrl)
        .slice(0, 5)
    : [];

  const assignmentPayload = {
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    subject: req.body.subject?.trim(),
    category: req.body.category || 'Other',
    assignmentType: req.body.assignmentType || 'Project',
    difficulty: req.body.difficulty || 'Medium',
    pricingType: req.body.pricingType || 'Fixed Price',
    budget: req.body.budget,
    deadline: req.body.deadline,
    maxWorkers: req.body.maxWorkers || 1,
    estimatedTime: req.body.estimatedTime?.trim(),
    skillsRequired,
    attachments,
    provider: req.user.id,
    posterSnapshot: {
      name: req.user.name,
      collegeId: req.user.collegeId || '',
      isVerified: Boolean(req.user.isVerified),
      rating: Number(req.user.rating) || 0,
    }
  };

  const assignment = await Assignment.create(assignmentPayload);

  // Update provider stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'providerStats.totalPosted': 1, 'providerStats.activeAssignments': 1 }
  });

  res.status(201).json({
    success: true,
    data: assignment
  });
});

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Provider only)
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }

  // Make sure user is assignment owner
  if (assignment.provider.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this assignment'
    });
  }

  assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: assignment
  });
});

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Provider only)
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }

  // Make sure user is assignment owner
  if (assignment.provider.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this assignment'
    });
  }

  await assignment.deleteOne();

  // Update provider stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'providerStats.activeAssignments': -1 }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Apply to assignment
// @route   POST /api/assignments/:id/apply
// @access  Private (Worker only)
exports.applyToAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Assignment not found'
    });
  }

  // Check if assignment is still open
  if (assignment.status !== 'Open') {
    return res.status(400).json({
      success: false,
      message: 'Assignment is no longer accepting applications'
    });
  }

  // Check if user already applied
  const existingApplication = await Application.findOne({
    assignment: req.params.id,
    worker: req.user.id
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied to this assignment'
    });
  }

  // Create application
  const application = await Application.create({
    assignment: req.params.id,
    worker: req.user.id,
    message: req.body.message,
    proposedBudget: req.body.proposedBudget,
    estimatedTime: req.body.estimatedTime,
    proposalMessage: req.body.proposalMessage
  });

  // Add application to assignment
  await Assignment.findByIdAndUpdate(req.params.id, {
    $push: { applications: application._id }
  });

  res.status(201).json({
    success: true,
    data: application
  });
});

// @desc    Get external marketplace assignments from Adzuna
// @route   GET /api/assignments/external/adzuna
// @access  Public
exports.getAdzunaMarketplaceAssignments = asyncHandler(async (req, res, next) => {
  try {
    const assignments = await fetchAdzunaMarketplaceAssignments({
      search: req.query.search,
      subject: req.query.subject,
      limit: req.query.limit,
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    const statusCode = error.statusCode === 401 ? 502 : error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to load Adzuna marketplace assignments.',
    });
  }
});
