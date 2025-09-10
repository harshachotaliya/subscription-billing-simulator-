/**
 * Transaction routes
 */

import express from 'express';
import { getTransactions } from '../controllers/transactionController.js';
import { validateTransactionQuery } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /transactions
 * @desc    Get all transactions for active subscriptions
 * @access  Public
 */
router.get('/', validateTransactionQuery, getTransactions);

export default router;
