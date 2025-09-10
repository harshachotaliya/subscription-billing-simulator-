/**
 * Subscription controller for handling subscription-related HTTP requests
 */

import { 
    createNewSubscription, 
    getAllActiveSubscriptions, 
    getSubscriptionByDonorId,
    deleteSubscription,
    filterSubscriptions 
} from '../services/subscriptionService.js';

/**
 * Create a new subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function createSubscription(req, res) {
    try {
        const subscription = await createNewSubscription(req.body);
        
        res.status(201).json({
            message: "Subscription created successfully",
            subscription: subscription
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        
        if (error.message.includes('already exists')) {
            return res.status(400).json({
                error: "Subscription already exists",
                message: error.message
            });
        }
        
        if (error.message.includes('not supported') || error.message.includes('Validation failed')) {
            return res.status(400).json({
                error: "Invalid request",
                message: error.message
            });
        }
        
        res.status(500).json({
            error: "Failed to create subscription",
            message: error.message
        });
    }
}

/**
 * Get all active subscriptions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getSubscriptions(req, res) {
    try {
        const subscriptions = getAllActiveSubscriptions();
        
        // Filter out amountInUSD from each subscription
        const filteredSubscriptions = filterSubscriptions(subscriptions, ["amountInUSD"]);
        
        res.status(200).json({
            subscriptions: filteredSubscriptions,
            summary: {
                totalSubscriptions: subscriptions.length
            }
        });
    } catch (error) {
        console.error("Error getting subscriptions:", error);
        res.status(500).json({
            error: "Failed to get subscriptions",
            message: error.message
        });
    }
}

/**
 * Delete a subscription (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteSubscriptionById(req, res) {
    try {
        const { donorId } = req.params;
        
        const subscription = getSubscriptionByDonorId(donorId);
        if (!subscription) {
            return res.status(404).json({ 
                error: "Subscription not found", 
                message: "Failed to delete subscription" 
            });
        }
        
        const deleted = deleteSubscription(donorId);
        if (deleted) {
            res.status(200).json({ 
                message: "Subscription deleted successfully" 
            });
        } else {
            res.status(500).json({ 
                error: "Failed to delete subscription", 
                message: "Unknown error occurred" 
            });
        }
    } catch (error) {
        console.error("Error deleting subscription:", error);
        res.status(500).json({ 
            error: "Failed to delete subscription", 
            message: error.message 
        });
    }
}
