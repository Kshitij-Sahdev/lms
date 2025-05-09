import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { UserRole, IUser } from '../models/User';
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
    
    const user = await User.findById(req.user.id)
      .select('-__v');
    
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
 * Get all users (admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify user is an admin
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { 
      search, 
      role, 
      limit = 20, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;
    
    // Build query
    const query: any = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
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
    
    // Build sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    
    // Find users
    const users = await User.find(query)
      .select('-__v')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    // Count total users for pagination
    const totalUsers = await User.countDocuments(query);
    
    return res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / Number(limit)),
      currentPage: Number(page),
      totalUsers,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify user is an admin or the user is requesting their own data
    if (req.user.role !== UserRole.ADMIN && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const user = await User.findById(req.params.id)
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify user is an admin
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update role
    user.role = role as UserRole;
    
    // If changing to teacher or admin, enable 2FA
    if (role === UserRole.TEACHER || role === UserRole.ADMIN) {
      user.requires2FA = true;
    }
    
    await user.save();
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ message: 'Server error' });
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
    
    // Update profile
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
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
 * Get user stats (admin only)
 */
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify user is an admin
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Count users by role
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: UserRole.STUDENT });
    const totalTeachers = await User.countDocuments({ role: UserRole.TEACHER });
    const totalAdmins = await User.countDocuments({ role: UserRole.ADMIN });
    
    // Count courses
    const totalCourses = await Course.countDocuments();
    const totalPublishedCourses = await Course.countDocuments({ published: true });
    
    // Count enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    
    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    
    // Get new enrollments in the last 30 days
    const newEnrollments = await Enrollment.countDocuments({
      enrolledAt: { $gte: thirtyDaysAgo },
    });
    
    return res.status(200).json({
      userStats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        newUsers,
      },
      courseStats: {
        totalCourses,
        totalPublishedCourses,
      },
      enrollmentStats: {
        totalEnrollments,
        newEnrollments,
      },
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
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
  updateUserRole,
  updateProfile,
  getTeachers,
  getUserStats,
  deleteUser,
}; 