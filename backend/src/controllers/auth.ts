import { Request, Response } from 'express';
import User, { UserRole, IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { createAndSend2FACode, verify2FACode } from '../utils/twoFactorAuth';
import { generateToken } from '../middleware/auth';
import TwoFactorCode from '../models/TwoFactorCode';

/**
 * Handle webhook from Clerk to create or update user in our database
 */
export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    
    // Handle user creation
    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = data;
      
      // Email might be in an array, get the primary one
      const email = email_addresses[0]?.email_address;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Create new user in our database
      const user = new User({
        clerkId: id,
        email,
        firstName: first_name || '',
        lastName: last_name || '',
        role: UserRole.STUDENT, // Default role is student
      });
      
      await user.save();
      
      return res.status(201).json({ message: 'User created successfully' });
    }
    
    // Handle user update
    if (type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      
      // Email might be in an array, get the primary one
      const email = email_addresses[0]?.email_address;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Find and update user in our database
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email,
          firstName: first_name || '',
          lastName: last_name || '',
        },
        { new: true }
      );
      
      if (!user) {
        // If user doesn't exist, create a new one
        const newUser = new User({
          clerkId: id,
          email,
          firstName: first_name || '',
          lastName: last_name || '',
          role: UserRole.STUDENT,
        });
        
        await newUser.save();
      }
      
      return res.status(200).json({ message: 'User updated successfully' });
    }
    
    // Handle user deletion
    if (type === 'user.deleted') {
      const { id } = data;
      
      // Delete user from our database
      await User.findOneAndDelete({ clerkId: id });
      
      return res.status(200).json({ message: 'User deleted successfully' });
    }
    
    // If we don't handle the event type
    return res.status(400).json({ message: 'Unsupported event type' });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get current user's data
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
 * Send 2FA code to user's email
 */
export const send2FACode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only send 2FA code if user's role requires it
    if (!user.requires2FA) {
      return res.status(400).json({ message: '2FA is not required for this user' });
    }
    
    // Generate and send code
    const codeSent = await createAndSend2FACode(email);
    
    if (!codeSent) {
      return res.status(500).json({ message: 'Failed to send 2FA code' });
    }
    
    return res.status(200).json({ message: '2FA code sent successfully' });
  } catch (error) {
    console.error('Send 2FA code error:', error);
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
    const user = await User.findOne({ email });
    
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
    
    // Generate token
    const token = generateToken(user._id.toString(), user.role.toString(), user.email);
    
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
    console.error('2FA verification error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  handleClerkWebhook,
  getCurrentUser,
  send2FACode,
  verify2FACode,
}; 