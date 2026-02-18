import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  const isDevelopment = config.nodeEnv === 'development';

  const errorResponse: any = {
    success: false,
    message,
    statusCode,
  };

  if (isDevelopment) {
    errorResponse.stack = err.stack;
  }

  console.error('❌ Error:', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: isDevelopment ? err.stack : undefined,
  });

  res.status(statusCode).json(errorResponse);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: ApiError = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
