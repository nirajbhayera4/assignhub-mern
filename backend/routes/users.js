const express = require('express');
const {
  getUsers,
  getUser,
  getUserWallet,
  getUserTransactions,
  processWithdrawal
} = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getUsers);

router
  .route('/:id')
  .get(protect, getUser);

router
  .route('/:id/wallet')
  .get(protect, getUserWallet);

router
  .route('/:id/transactions')
  .get(protect, getUserTransactions);

router
  .route('/:id/withdraw')
  .post(protect, processWithdrawal);

module.exports = router;
