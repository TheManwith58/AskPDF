import { Request, Response, NextFunction } from 'express';

// Standardized error response format
export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error(`[Error] ${err.message || err}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Only include stack traces in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};