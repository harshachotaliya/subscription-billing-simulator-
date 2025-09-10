/**
 * Main routes file that combines all route modules
 */

import express from 'express';
import subscriptionRoutes from './subscriptionRoutes.js';
import transactionRoutes from './transactionRoutes.js';

const router = express.Router();

// Mount route modules
router.use('/subscriptions', subscriptionRoutes);
router.use('/transactions', transactionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Subscription Billing Simulator API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
