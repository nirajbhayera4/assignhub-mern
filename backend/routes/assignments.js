const express = require('express');
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  applyToAssignment
} = require('../controllers/assignmentController');

const Assignment = require('../models/Assignment');

const router = express.Router();

// Middleware
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Routes
router
  .route('/')
  .get(getAssignments)
  .post(protect, createAssignment);

router
  .route('/:id')
  .get(getAssignment)
  .put(protect, updateAssignment)
  .delete(protect, deleteAssignment);

router
  .route('/:id/apply')
  .post(protect, applyToAssignment);

module.exports = router;
