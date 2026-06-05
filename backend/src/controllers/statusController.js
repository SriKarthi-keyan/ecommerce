/**
 * Check Server Health and Metrics
 * @route GET /api/status
 * @access Public
 */
export const getStatus = (req, res, next) => {
  try {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Server is running smoothly',
        uptime: parseFloat(uptime.toFixed(2)),
        timestamp,
        environment
      }
    });
  } catch (error) {
    next(error);
  }
};
