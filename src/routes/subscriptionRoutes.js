/**
 * Subscription routes
 */

import express from 'express';
import { 
    createSubscription, 
    getSubscriptions, 
    deleteSubscriptionById 
} from '../controllers/subscriptionController.js';
import { validateSubscriptionRequest } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /subscriptions
 * @desc    Create a new subscription
 * @access  Public
 */
router.post('/', validateSubscriptionRequest, createSubscription);

/**
 * @route   GET /subscriptions
 * @desc    Get all active subscriptions
 * @access  Public
 */
router.get('/', getSubscriptions);

/**
 * @route   DELETE /subscriptions/:donorId
 * @desc    Delete a subscription by donor ID
 * @access  Public
 */
router.delete('/:donorId', deleteSubscriptionById);

export default router;
