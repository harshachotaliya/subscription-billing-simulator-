/**
 * Transaction service for managing transaction data and business logic
 */

import { createTransaction } from '../models/Transaction.js';
import { getSubscriptionsStorage } from './subscriptionService.js';

// In-memory storage for transactions (in production, this would be a database)
const transactions = [];

/**
 * Create a new transaction
 * @param {Object} subscription - The subscription data
 * @returns {Object} - The created transaction
 */
export function createNewTransaction(subscription) {
    const transaction = createTransaction(subscription);
    transactions.push(transaction);
    return transaction;
}

/**
 * Get all transactions for active subscriptions
 * @param {string} donorId - Optional donor ID to filter by
 * @returns {Array} - Array of transactions
 */
export function getAllTransactions(donorId = null) {
    const subscriptions = getSubscriptionsStorage();
    const activeDonorIds = Object.values(subscriptions)
        .filter(subscription => subscription.active)
        .map(subscription => subscription.donorId);

    let result = transactions.filter(transaction => 
        activeDonorIds.includes(transaction.donorId)
    );

    if (donorId) {
        result = result.filter(transaction => transaction.donorId === donorId);
    }

    return result;
}

/**
 * Get all transactions (including from inactive subscriptions)
 * @returns {Array} - Array of all transactions
 */
export function getAllTransactionsRaw() {
    return transactions;
}

/**
 * Get transactions storage (for internal use)
 * @returns {Array} - The transactions storage array
 */
export function getTransactionsStorage() {
    return transactions;
}
