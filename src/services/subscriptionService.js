/**
 * Subscription service for managing subscription data and business logic
 */

import { convertToUSD, isCurrencySupported, getSupportedCurrencies } from './currencyService.js';
import { analyzeCampaign, analyzeCampaignFallback } from './llmService.js';
import { createSubscription, validateSubscription } from '../models/Subscription.js';

// In-memory storage (in production, this would be a database)
const subscriptions = {};

/**
 * Create a new subscription
 * @param {Object} subscriptionData - The subscription data
 * @returns {Promise<Object>} - The created subscription
 */
export async function createNewSubscription(subscriptionData) {
    const validation = validateSubscription(subscriptionData);
    if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const { donorId, amount, currency, interval, campaignDescription } = subscriptionData;

    // Validate currency
    if (!isCurrencySupported(currency)) {
        throw new Error(`Currency ${currency} is not supported. Supported currencies: ${getSupportedCurrencies().join(', ')}`);
    }

    // Check if subscription already exists
    if (subscriptions[donorId]) {
        throw new Error('Subscription already exists');
    }

    // Convert amount to USD for normalization
    const amountInUSD = convertToUSD(amount, currency);

    // Analyze campaign using LLM
    let campaignAnalysis;
    if (process.env.GEMINI_API_KEY) {
        campaignAnalysis = await analyzeCampaign(campaignDescription);
    } else {
        console.log("OpenAI API key not found, using fallback analysis");
        campaignAnalysis = analyzeCampaignFallback(campaignDescription);
    }

    const subscription = createSubscription({
        donorId,
        amount,
        currency,
        amountInUSD,
        interval,
        campaignDescription,
        campaignTags: campaignAnalysis.tags,
        campaignSummary: campaignAnalysis.summary
    });

    subscriptions[donorId] = subscription;
    return subscription;
}

/**
 * Get all active subscriptions
 * @returns {Array} - Array of active subscriptions
 */
export function getAllActiveSubscriptions() {
    return Object.values(subscriptions).filter(subscription => subscription.active);
}

/**
 * Get subscription by donor ID
 * @param {string} donorId - The donor ID
 * @returns {Object|null} - The subscription or null if not found
 */
export function getSubscriptionByDonorId(donorId) {
    return subscriptions[donorId] || null;
}

/**
 * Delete a subscription (soft delete)
 * @param {string} donorId - The donor ID
 * @returns {boolean} - True if deleted, false if not found
 */
export function deleteSubscription(donorId) {
    if (!subscriptions[donorId]) {
        return false;
    }

    subscriptions[donorId] = {
        ...subscriptions[donorId],
        active: false,
        deletedAt: new Date().toISOString()
    };

    return true;
}

/**
 * Get all subscriptions (including inactive)
 * @returns {Array} - Array of all subscriptions
 */
export function getAllSubscriptions() {
    return Object.values(subscriptions);
}

/**
 * Filter subscriptions by removing specified keys
 * @param {Array} subscriptions - Array of subscriptions
 * @param {Array} keysToFilter - Array of keys to remove
 * @returns {Array} - Filtered subscriptions
 */
export function filterSubscriptions(subscriptions, keysToFilter) {
    return subscriptions.map(subscription => {
        const filtered = { ...subscription };
        keysToFilter.forEach(key => delete filtered[key]);
        return filtered;
    });
}

/**
 * Get subscriptions storage (for internal use)
 * @returns {Object} - The subscriptions storage object
 */
export function getSubscriptionsStorage() {
    return subscriptions;
}
