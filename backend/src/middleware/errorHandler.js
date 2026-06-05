/**
 * Express Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error stack to console if not in production
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Expose stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
