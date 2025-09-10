/**
 * Express application setup and configuration
 */

import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { startBillingProcess } from './services/billingService.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start billing process
const billingInterval = startBillingProcess(5000);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    if (billingInterval) {
        clearInterval(billingInterval);
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Graceful shutdown...');
    if (billingInterval) {
        clearInterval(billingInterval);
    }
    process.exit(0);
});

export default app;
