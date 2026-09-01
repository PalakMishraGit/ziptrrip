export function errorHandler(err, req, res, next) {
  console.error('🔥 Global Server Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}
