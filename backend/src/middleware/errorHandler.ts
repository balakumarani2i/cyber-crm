import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError extends Error {
  statusCode: number;
  userMessage: string;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  userMessage: string;

  constructor(message: string, statusCode: number, userMessage?: string) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage || message;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let userMessage = 'An unexpected error occurred. Please try again.';

  // Zod validation errors
  if (error instanceof z.ZodError) {
    statusCode = 400;
    const fieldErrors = error.issues.map(issue => 
      `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');
    userMessage = `Validation failed: ${fieldErrors}`;
  }
  
  // Prisma errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        userMessage = 'This record already exists. Please use different values.';
        break;
      case 'P2025':
        statusCode = 404;
        userMessage = 'The requested record was not found.';
        break;
      case 'P2003':
        statusCode = 400;
        userMessage = 'Cannot delete this record as it is referenced by other data.';
        break;
      default:
        statusCode = 400;
        userMessage = 'Database operation failed. Please check your data and try again.';
    }
  }
  
  // Custom app errors
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    userMessage = error.userMessage;
  }
  
  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    userMessage = 'Invalid authentication token. Please log in again.';
  }
  
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    userMessage = 'Your session has expired. Please log in again.';
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};