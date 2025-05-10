import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRole } from '../models/User';
import User from '../models/User';

dotenv.config();

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_dev';

// Extended Request type with user property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    clerkId?: string;
  };
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Check if this is a JWT token (our own) or a Clerk token
    const isClerkToken = token.startsWith('clerk.');
    
    if (isClerkToken) {
      // For Clerk tokens, extract user info and find in our database
      // Note: In production, you should properly verify the Clerk token
      // This assumes the clerkId is in the Clerk JWT payload
      
      // Extract clerk user ID from token if possible
      let clerkId;
      try {
        // This is simplified - in production you should properly verify the token
        const decoded = jwt.decode(token);
        
        if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
          clerkId = decoded.sub as string;
        }
      } catch (error) {
        console.error('Error decoding Clerk token:', error);
      }
      
      if (!clerkId) {
        return res.status(401).json({ message: 'Invalid Clerk token' });
      }
      
      // Find the user by Clerk ID
      const user = await User.findOne({ clerkId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found with the provided Clerk ID' });
      }
      
      // Add user to request
      req.user = {
        id: (user as any)._id.toString(),
        email: user.email,
        role: user.role,
        clerkId: user.clerkId
      } as {
        id: string;
        email: string;
        role: UserRole;
        clerkId?: string;
      };
      
      next();
    } else {
      // For our own JWT tokens
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: UserRole;
      };
      
      // Add user to request
      req.user = decoded;
      next();
    }
  } catch (error) {
    console.error('Authentication error:', error);
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