import express from 'express';
import { Request, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import User, { UserRole } from '../models/User';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await User.findById(req.user.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', authenticate, authorize([UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { firstName, lastName, profilePicture } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticate, authorize([UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    
    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role as UserRole;
    
    // Teachers and admins need 2FA
    if (role === UserRole.TEACHER || role === UserRole.ADMIN) {
      user.requires2FA = true;
    }
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teachers
router.get('/teachers', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const teachers = await User.find({ role: UserRole.TEACHER }).select('-__v');
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats (admin only)
router.get('/stats', authenticate, authorize([UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: UserRole.STUDENT });
    const totalTeachers = await User.countDocuments({ role: UserRole.TEACHER });
    const totalAdmins = await User.countDocuments({ role: UserRole.ADMIN });
    
    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 