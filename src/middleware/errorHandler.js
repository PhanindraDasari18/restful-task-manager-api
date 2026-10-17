module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err.stack || err);
  }

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error'
    }
  });
};
