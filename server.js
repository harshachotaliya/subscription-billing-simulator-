import express from "express";
import { analyzeCampaign, analyzeCampaignFallback } from "./llmService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const subscriptions = {};

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

        if (subscriptions[donorId]) {
            return res.status(400).json({
                error: "Subscription already exists",
                message: "Subscription already exists"
            });
        }

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
            interval,
            campaignDescription,
            campaignTags: campaignAnalysis.tags,
            campaignSummary: campaignAnalysis.summary,
            createdAt: new Date().toISOString()
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
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error getting subscriptions:", error);
        res.status(500).json({
            error: "Failed to get subscriptions",
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No (using fallback)'}`);
});