/**
 * Subscription model and validation
 */

export const SUPPORTED_INTERVALS = ['minute', 'daily', 'weekly', 'monthly', 'yearly'];

/**
 * Validate if an interval is supported
 * @param {string} interval - The interval to validate
 * @returns {boolean} - True if supported, false otherwise
 */
export function isIntervalSupported(interval) {
    return SUPPORTED_INTERVALS.includes(interval);
}

/**
 * Get all supported intervals
 * @returns {string[]} - Array of supported intervals
 */
export function getSupportedIntervals() {
    return SUPPORTED_INTERVALS;
}

/**
 * Create a subscription object
 * @param {Object} data - Subscription data
 * @returns {Object} - Subscription object
 */
export function createSubscription(data) {
    const {
        donorId,
        amount,
        currency,
        amountInUSD,
        interval,
        campaignDescription,
        campaignTags,
        campaignSummary
    } = data;

    return {
        donorId,
        amount,
        currency,
        amountInUSD,
        interval,
        campaignDescription,
        campaignTags,
        campaignSummary,
        createdAt: new Date().toISOString(),
        active: true,
        lastChargedAt: null
    };
}

/**
 * Validate subscription data
 * @param {Object} data - Subscription data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateSubscription(data) {
    const errors = [];
    const { donorId, amount, currency, interval, campaignDescription } = data;

    if (!donorId) {
        errors.push('donorId is required');
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        errors.push('amount must be a positive number');
    }

    if (!currency) {
        errors.push('currency is required');
    }

    if (!interval) {
        errors.push('interval is required');
    } else if (!isIntervalSupported(interval)) {
        errors.push(`interval ${interval} is not supported`);
    }

    if (!campaignDescription) {
        errors.push('campaignDescription is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
