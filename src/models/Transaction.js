/**
 * Transaction model and validation
 */

/**
 * Create a transaction object
 * @param {Object} subscription - The subscription data
 * @returns {Object} - Transaction object
 */
export function createTransaction(subscription) {
    return {
        id: crypto.randomUUID(),
        donorId: subscription.donorId,
        amount: subscription.amount,
        currency: subscription.currency,
        amountInUSD: subscription.amountInUSD,
        interval: subscription.interval,
        campaignDescription: subscription.campaignDescription,
        campaignTags: subscription.campaignTags,
        campaignSummary: subscription.campaignSummary,
        createdAt: new Date().toISOString(),
        lastChargedAt: new Date().toISOString()
    };
}

/**
 * Validate transaction query parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateTransactionQuery(query) {
    const errors = [];
    const { donorId } = query;

    if (donorId && typeof donorId !== 'string') {
        errors.push('donorId must be a string');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
