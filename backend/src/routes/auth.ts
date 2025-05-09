import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { authenticate } from '../middleware/auth';
import { 
  getCurrentUser, 
  handleClerkWebhook, 
  send2FACode, 
  verify2FACode 
} from '../controllers/auth';

const router = express.Router();

// Clerk webhook
router.post('/clerk-webhook', handleClerkWebhook);

// Get current user
router.get('/me', authenticate, getCurrentUser);

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, clerkId, role = UserRole.STUDENT } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !clerkId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      clerkId,
      role,
      requires2FA: role === UserRole.TEACHER || role === UserRole.ADMIN,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        requires2FA: user.requires2FA,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login with Clerk authentication
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { clerkToken, clerkId } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: 'Clerk ID is required' });
    }

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user needs 2FA
    if (user.requires2FA) {
      return res.status(200).json({
        requires2FA: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 2FA routes
router.post('/2fa/send', send2FACode);
router.post('/2fa/verify', verify2FACode);

export default router; 