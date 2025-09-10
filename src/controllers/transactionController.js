/**
 * Transaction controller for handling transaction-related HTTP requests
 */

import { getAllTransactions } from '../services/transactionService.js';


/**
 * Get all transactions for active subscriptions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getTransactions(req, res) {
    try {
        const { donorId } = req.query;
        const transactions = getAllTransactions(donorId);
        
        res.status(200).json({
            transactions: transactions,
            summary: {
                totalTransactions: transactions.length
            }
        });
    } catch (error) {
        console.error("Error getting transactions:", error);
        res.status(500).json({
            error: "Failed to get transactions",
            message: error.message
        });
    }
}
