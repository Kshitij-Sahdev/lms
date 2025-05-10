import api from './api';
import { User, UserRole, UserStats } from '@/types';

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (params?: {
  search?: string;
  role?: UserRole;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

/**
 * Get recent users (admin only)
 */
export const getRecentUsers = async (limit = 5) => {
  try {
    const response = await api.get('/users', { 
      params: { 
        limit, 
        page: 1, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error getting recent users:', error);
    throw error;
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (id: string, role: UserRole) => {
  try {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}) => {
  try {
    const response = await api.put('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Get teachers
 */
export const getTeachers = async (params?: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  try {
    const response = await api.get('/users/teachers', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting teachers:', error);
    throw error;
  }
};

/**
 * Get user stats (admin only)
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await api.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Send a 2FA verification code to the user's email
 */
export const send2FACode = async (email: string): Promise<boolean> => {
  try {
    await api.post('/auth/2fa/send', { email });
    return true;
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return false;
  }
};

/**
 * Verify a 2FA code
 */
export const verify2FACode = async (
  email: string,
  code: string
): Promise<{ success: boolean; token?: string }> => {
  try {
    const response = await api.post<{ success: boolean; token: string }>(
      '/auth/2fa/verify',
      { email, code }
    );
    
    // If verification is successful, save the token
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('2fa_verified', 'true');
    }
    
    return response;
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    return { success: false };
  }
};

/**
 * Check if a user has admin role
 */
export const isAdmin = (user?: User | null): boolean => {
  return user?.role === UserRole.ADMIN;
};

/**
 * Check if a user has teacher role
 */
export const isTeacher = (user?: User | null): boolean => {
  return user?.role === UserRole.TEACHER;
};

/**
 * Check if a user has student role
 */
export const isStudent = (user?: User | null): boolean => {
  return user?.role === UserRole.STUDENT;
};

/**
 * Get the appropriate dashboard URL based on user role
 */
export const getDashboardUrl = (user?: User | null): string => {
  if (isAdmin(user)) {
    return '/admin/dashboard';
  }
  if (isTeacher(user)) {
    return '/teacher/dashboard';
  }
  return '/dashboard';
};

export default {
  getCurrentUser,
  getAllUsers,
  getRecentUsers,
  getUserById,
  updateUserRole,
  updateProfile,
  getTeachers,
  getUserStats,
  deleteUser,
  send2FACode,
  verify2FACode,
  isAdmin,
  isTeacher,
  isStudent,
  getDashboardUrl,
}; 