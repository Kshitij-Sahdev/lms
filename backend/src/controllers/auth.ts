import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { IUser, UserRole } from '../models/User';
import TwoFactorCode from '../models/TwoFactorCode';
import { generateToken } from '../middleware/auth';
import { createAndSend2FACode } from '../utils/twoFactorAuth';
import mongoose from 'mongoose';

/**
 * Get current user
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await User.findById(req.user.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Handle Clerk webhook events
 */
export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    // Get the webhook data
    const { data, type } = req.body;
    
    // Process user creation event
    if (type === 'user.created') {
      // Extract user data from Clerk webhook
      const { id, email_addresses, first_name, last_name } = data;
      
      // Check if user exists
      const existingUser = await User.findOne({ email: email_addresses[0].email_address });
      
      if (!existingUser) {
        // Create new user
        const newUser = new User({
          firstName: first_name || 'User',
          lastName: last_name || 'Name',
          email: email_addresses[0].email_address,
          clerkId: id,
          role: UserRole.STUDENT, // Default role
        });
        
        await newUser.save();
        console.log(`User created from Clerk webhook: ${newUser.email}`);
      }
    }
    
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing error' });
  }
};

/**
 * Create and send 2FA code
 */
export const send2FACode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user requires 2FA
    if (!user.requires2FA) {
      return res.status(400).json({ message: 'This user does not require 2FA' });
    }
    
    // Create and send code
    const success = await createAndSend2FACode(email);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to create or send 2FA code' });
    }
    
    return res.status(200).json({ message: 'Code sent successfully' });
  } catch (error) {
    console.error('2FA send error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Verify 2FA code
 */
export const verify2FACode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }
    
    // Find user
    const user = await User.findOne({ email }).lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the most recent valid code
    const twoFactorCode = await TwoFactorCode.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    
    if (!twoFactorCode) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    
    // Mark code as used
    twoFactorCode.used = true;
    await twoFactorCode.save();
    
    // Get user ID as string
    const userId = user._id ? user._id.toString() : '';
    const userRole = user.role ? user.role.toString() : '';
    
    // Generate token
    const token = generateToken(userId, userRole, user.email);
    
    return res.status(200).json({
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getCurrentUser,
  handleClerkWebhook,
  send2FACode,
  verify2FACode,
}; 