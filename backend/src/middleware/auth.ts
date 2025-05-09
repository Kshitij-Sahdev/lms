import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRole } from '../models/User';

dotenv.config();

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_dev';

// Extended Request type with user property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      email: string;
      role: UserRole;
    };

    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Authorization middleware to check if user has required role
 */
export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }

    next();
  };
};

/**
 * Generates a JWT token for a user
 */
export const generateToken = (
  userId: string,
  userRole: string,
  userEmail: string
): string => {
  return jwt.sign(
    { id: userId, role: userRole, email: userEmail },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default {
  authenticate,
  authorize,
  generateToken,
}; 