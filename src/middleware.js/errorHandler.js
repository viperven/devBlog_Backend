// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
