/**
 * Validation middleware for request validation
 */

import { isCurrencySupported, getSupportedCurrencies } from '../services/currencyService.js';
import { isIntervalSupported, getSupportedIntervals } from '../models/Subscription.js';

/**
 * Validate subscription creation request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function validateSubscriptionRequest(req, res, next) {
    const { donorId, amount, currency, interval, campaignDescription } = req.body;

    // Validate required fields
    if (!donorId || !amount || !currency || !interval || !campaignDescription) {
        return res.status(400).json({
            error: "Missing required fields",
            message: "All fields (donorId, amount, currency, interval, campaignDescription) are required"
        });
    }

    // Validate currency
    if (!isCurrencySupported(currency)) {
        return res.status(400).json({
            error: "Unsupported currency",
            message: `Currency ${currency} is not supported. Supported currencies: ${getSupportedCurrencies().join(', ')}`
        });
    }

    // Validate interval
    if (!isIntervalSupported(interval)) {
        return res.status(400).json({
            error: "Unsupported interval",
            message: `Interval ${interval} is not supported. Supported intervals: ${getSupportedIntervals().join(', ')}`
        });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: "Invalid amount",
            message: "Amount must be a positive number"
        });
    }

    next();
}

/**
 * Validate transaction query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function validateTransactionQuery(req, res, next) {
    const { donorId } = req.query;

    if (donorId && typeof donorId !== 'string') {
        return res.status(400).json({
            error: "Invalid donorId",
            message: "donorId must be a string"
        });
    }

    next();
}
