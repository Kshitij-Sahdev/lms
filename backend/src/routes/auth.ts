import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
    const { firstName, lastName, email, password, role = UserRole.STUDENT } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      passwordHash,
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

// Password login
router.post('/password-login', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt with:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { 
      id: user._id, 
      email: user.email, 
      hasPasswordHash: !!user.passwordHash,
      role: user.role 
    });

    // Check if admin and using default password
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@knowledgechakra.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass@2023!';
    
    let isValidPassword = false;
    
    // Special handling for demo accounts and admin
    if (email === adminEmail && password === adminPassword) {
      console.log('Admin login with default password');
      isValidPassword = true;
    } else if (user.passwordHash) {
      // For regular users with password hash
      isValidPassword = await bcrypt.compare(password, user.passwordHash);
      console.log('Password validation result:', isValidPassword);
    } else {
      // Special handling for existing test users without password hash
      const isDemoTeacher = email.includes('teacher') && email.endsWith('@knowledgechakra.com') && password === 'Teacher123!';
      const isDemoStudent = email.includes('student') && email.endsWith('@knowledgechakra.com') && password === 'Student123!';
      
      console.log('No password hash found, checking demo credentials');
      
      if (isDemoTeacher || isDemoStudent) {
        isValidPassword = true;
        console.log('Demo user login successful');
        
        // Create password hash for future logins
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        await user.save();
      }
    }
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user needs 2FA
    if (user.requires2FA) {
      console.log('User requires 2FA verification');
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

    console.log('Login successful for:', email);
    
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

// Debug route to check admin user
router.get('/debug-admin', async (req: Request, res: Response) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@knowledgechakra.com';
    const user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    
    return res.status(200).json({
      exists: true,
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      hasPasswordHash: !!user.passwordHash,
    });
  } catch (error) {
    console.error('Debug admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 