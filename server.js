import express from "express";
import { analyzeCampaign, analyzeCampaignFallback } from "./llmService.js";
import { convertToUSD, isCurrencySupported, getSupportedCurrencies } from "./currencyService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const subscriptions = {};

const transactions = []

/**
 * Create a subscription
 * @param {string} donorId - The donor id
 * @param {number} amount - The amount
 * @param {string} currency - The currency
 * @param {string} interval - The interval
 * @param {string} campaignDescription - The campaign description
 * @returns {object} - The subscription
 */
app.post("/subscriptions", async (req, res) => {
    try {
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

        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount",
                message: "Amount must be a positive number"
            });
        }

        if (subscriptions[donorId]) {
            return res.status(400).json({
                error: "Subscription already exists",
                message: "Subscription already exists"
            });
        }

        // Convert amount to USD for normalization
        const amountInUSD = convertToUSD(amount, currency);

        // Analyze campaign using LLM
        let campaignAnalysis;
        if (process.env.OPENAI_API_KEY) {
            campaignAnalysis = await analyzeCampaign(campaignDescription);
        } else {
            console.log("OpenAI API key not found, using fallback analysis");
            campaignAnalysis = analyzeCampaignFallback(campaignDescription);
        }

        const subscription = {
            donorId,
            amount,
            currency,
            amountInUSD,
            interval,
            campaignDescription,
            campaignTags: campaignAnalysis.tags,
            campaignSummary: campaignAnalysis.summary,
            createdAt: new Date().toISOString(),
            active: true,
            lastChargedAt: null
        };

        subscriptions[donorId] = subscription;
        res.status(201).json({
            message: "Subscription created successfully",
            subscription: subscription
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({
            error: "Failed to create subscription",
            message: error.message
        });
    }
});

/**
 * Get all subscriptions
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The subscriptions
 */
app.get("/subscriptions", async(req, res) => {
    try{
        const result = Object.values(subscriptions);

        // Filter out amountInUSD from each subscription
        let filteredSubscriptions = await filterSubscriptions(result, ["amountInUSD"]);
        filteredSubscriptions = filteredSubscriptions.filter(subscription => subscription.active);

        return res.status(200).json({
            subscriptions: filteredSubscriptions,
            summary: {
                totalSubscriptions: result.length
            }
        });
    } catch (error) {
        console.error("Error getting subscriptions:", error);
        res.status(500).json({
            error: "Failed to get subscriptions",
            message: error.message
        });
    }
});

/**
 * Delete a subscription
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The subscription
 */
app.delete("/subscriptions/:donorId", async(req, res) => {
    try{
        const { donorId } = req.params;
        if (!subscriptions[donorId]) {
            return res.status(404).json({ error: "Subscription not found", message: "Failed to delete subscription" });
        }
        delete subscriptions[donorId];
        return res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        res.status(500).json({ error: "Failed to delete subscription", message: error.message });
    }
});

/**
 *
 * @param {*} subscriptions
 * @returns
 */
async function filterSubscriptions(subscriptions, keysToFilter) {
    const result = Object.values(subscriptions);
    const filteredSubscriptions = result.map(subscription => {
        const filtered = { ...subscription };
        keysToFilter.forEach(key => delete filtered[key]);
        return filtered;
    });
    return filteredSubscriptions;
}

function processChargedSubscription(subscription, now) {
    if (!subscription.active) return false;

    if (!subscription.lastChargedAt) return true;

    const lastChargedAt = new Date(subscription.lastChargedAt);

    const diffInMinutes = (now - lastChargedAt) / (1000 * 60);
    const diffInDays = diffInMinutes / 1440; // 1440 minutes = 1 day

    switch (subscription.interval) {
        case 'minute':
        console.log('Inside minutes')
            return  diffInMinutes >=  1;

        case 'daily':
            return diffInDays >=  1;

        case 'weekly':
            return diffInDays >=  7;

        case 'monthly':
            return diffInDays >=  30;

        case 'yearly':
            return diffInDays >=  365;

        default:
            return false;
    }
}

function processCharges () {
    Object.values(subscriptions).forEach(subscription => {
        const now = new Date();
        if (processChargedSubscription(subscription, now)) {
            const transaction = {
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
                lastChargedAt: new Date().toISOString(),
            }
            transactions.push(transaction);
            subscription.lastChargedAt = now;
        }
    });
}

app.get("/transactions", async(req, res) => {
    try{
        const result = Object.values(transactions);
        return res.status(200).json({
            transactions: result,
            summary: {
                totalSubscriptions: result.length
            }
        });
    } catch (error) {
        console.error("Error getting transactions:", error);
        res.status(500).json({
            error: "Failed to get transactions",
            message: error.message
        });
    }
});

setInterval(()  => {
    console.log("Processing charges");


    processCharges();
}, 5000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No (using fallback)'}`);
});