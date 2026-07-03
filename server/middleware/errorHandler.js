/**
 * Centralized error handler. Any `next(error)` call in a controller ends up
 * here, so error formatting only has to be written once.
 */
export function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Something went wrong. Please try again later."
      : err.message;

  res.status(statusCode).json({ error: message });
}

/**
 * Catches requests to routes that don't exist.
 */
export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
}
