/**
 * Billing service for processing subscription charges
 */

import { getSubscriptionsStorage } from './subscriptionService.js';
import { createNewTransaction } from './transactionService.js';

/**
 * Process charges for a subscription
 * @param {Object} subscription - The subscription
 * @param {Date} now - The current date
 * @returns {boolean} - True if charged, false otherwise
 */
function processChargedSubscription(subscription, now) {
    if (!subscription.active) return false;

    if (!subscription.lastChargedAt) return true;

    const lastChargedAt = new Date(subscription.lastChargedAt);

    const diffInMinutes = (now - lastChargedAt) / (1000 * 60);
    const diffInDays = diffInMinutes / 1440; // 1440 minutes = 1 day

    switch (subscription.interval) {
        case 'minute':
            return diffInMinutes >= 1;

        case 'daily':
            return diffInDays >= 1;

        case 'weekly':
            return diffInDays >= 7;

        case 'monthly':
            return diffInDays >= 30;

        case 'yearly':
            return diffInDays >= 365;

        default:
            return false;
    }
}

/**
 * Process charges for all active subscriptions
 * @returns {Array} - Array of created transactions
 */
export function processCharges() {
    const subscriptions = getSubscriptionsStorage();
    const createdTransactions = [];

    Object.values(subscriptions).forEach(subscription => {
        const now = new Date();
        if (processChargedSubscription(subscription, now)) {
            const transaction = createNewTransaction(subscription);
            createdTransactions.push(transaction);
            
            // Update subscription's last charged time
            subscription.lastChargedAt = now;
        }
    });

    return createdTransactions;
}

/**
 * Start the billing process with interval
 * @param {number} intervalMs - Interval in milliseconds (default: 5000ms)
 * @returns {Object} - Interval reference for stopping
 */
export function startBillingProcess(intervalMs = 5000) {
    console.log("Starting billing process...");
    
    const interval = setInterval(() => {
        console.log("Processing charges");
        processCharges();
    }, intervalMs);

    return interval;
}

/**
 * Stop the billing process
 * @param {Object} interval - The interval reference
 */
export function stopBillingProcess(interval) {
    if (interval) {
        clearInterval(interval);
        console.log("Billing process stopped");
    }
}
