import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { UserRole } from '../models/User';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';

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
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
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
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req: Request, res: Response) => {
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
};

/**
 * Get user stats (admin only)
 */
export const getUserStats = async (req: Request, res: Response) => {
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
};

/**
 * Get teachers
 */
export const getTeachers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { search, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query: any = { role: UserRole.TEACHER };
    
    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find teachers
    const teachers = await User.find(query)
      .select('firstName lastName email profilePicture')
      .sort({ firstName: 1, lastName: 1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total teachers for pagination
    const totalTeachers = await User.countDocuments(query);
    
    return res.status(200).json({
      teachers,
      totalPages: Math.ceil(totalTeachers / Number(limit)),
      currentPage: Number(page),
      totalTeachers,
    });
  } catch (error) {
    console.error('Error getting teachers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify user is an admin
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { id } = req.params;
    
    // Check if trying to delete themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If teacher, check if they have courses
    if (user.role === UserRole.TEACHER) {
      const courseCount = await Course.countDocuments({ instructor: id });
      
      if (courseCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete teacher with courses. Please reassign or delete their courses first.' 
        });
      }
    }
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    // Delete enrollments
    await Enrollment.deleteMany({ student: id });
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  getUserStats,
  deleteUser,
}; 