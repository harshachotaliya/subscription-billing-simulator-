/**
 * Error handling middleware
 */

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function errorHandler(err, req, res, next) {
    console.error("Error:", err);

    // Default error response
    let statusCode = 500;
    let message = "Internal server error";

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = "Invalid data format";
    } else if (err.message && err.message.includes('not found')) {
        statusCode = 404;
        message = err.message;
    } else if (err.message && err.message.includes('already exists')) {
        statusCode = 400;
        message = err.message;
    } else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        error: "Request failed",
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * 404 handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function notFoundHandler(req, res, next) {
    res.status(404).json({
        error: "Not found",
        message: `Route ${req.method} ${req.path} not found`
    });
}
