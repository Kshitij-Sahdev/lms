import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { User } from '@/types';
import { getUserStats, getRecentUsers } from '@/utils/userService';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { UserStats } from '../../types';

// Stats card component
const StatsCard: React.FC<{ title: string; value: number; icon: string; change?: number }> = ({ 
  title, 
  value, 
  icon,
  change
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
        </div>
        <div className="text-2xl text-primary">{icon}</div>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
      
      {change !== undefined && (
        <div className={`mt-2 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
        </div>
      )}
    </div>
  );
};

// User item component
const UserItem: React.FC<{ user: User }> = ({ user }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="py-3 border-b border-background-elevated last:border-0 flex items-center">
      <div className="w-10 h-10 rounded-full bg-background-elevated flex items-center justify-center mr-3">
        {user.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-300">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-white">{user.firstName} {user.lastName}</h3>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
      
      <div className="flex flex-col items-end">
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.role === 'admin' ? 'bg-primary/30 text-primary' :
          user.role === 'teacher' ? 'bg-blue-900/30 text-blue-400' :
          'bg-green-900/30 text-green-400'
        }`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
        <span className="text-xs text-gray-400 mt-1">
          Joined {formatDate(user.createdAt)}
        </span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { getToken } = useClerkAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        // const token = await getToken();
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        
        // Mock data
        const mockStats = {
          userStats: {
            totalUsers: 125,
            totalStudents: 100,
            totalTeachers: 20,
            totalAdmins: 5,
            newUsers: 15
          },
          courseStats: {
            totalCourses: 30,
            totalPublishedCourses: 25
          },
          enrollmentStats: {
            totalEnrollments: 350,
            newEnrollments: 42
          }
        };
        
        setStats(mockStats as UserStats);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminStats();
  }, [getToken]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-surface-light rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface p-6 rounded-lg">
              <div className="h-6 bg-surface-light rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-10 bg-surface-light rounded w-1/3"></div>
                <div className="h-4 bg-surface-light rounded w-full"></div>
                <div className="h-4 bg-surface-light rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-8 bg-surface-light rounded w-1/4 my-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-lg h-64"></div>
          <div className="bg-surface p-6 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Users:</span>
              <span className="font-bold">{stats?.userStats.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Students:</span>
              <span>{stats?.userStats.totalStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Teachers:</span>
              <span>{stats?.userStats.totalTeachers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Admins:</span>
              <span>{stats?.userStats.totalAdmins}</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>New Users (30 days):</span>
              <span className="font-bold">+{stats?.userStats.newUsers}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Course Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Courses:</span>
              <span className="font-bold">{stats?.courseStats.totalCourses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Published Courses:</span>
              <span>{stats?.courseStats.totalPublishedCourses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Draft Courses:</span>
              <span>{stats && (stats.courseStats.totalCourses - stats.courseStats.totalPublishedCourses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Average Students per Course:</span>
              <span>
                {stats && Math.round(stats.enrollmentStats.totalEnrollments / stats.courseStats.totalPublishedCourses)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Enrollment Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Enrollments:</span>
              <span className="font-bold">{stats?.enrollmentStats.totalEnrollments}</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>New Enrollments (30 days):</span>
              <span className="font-bold">+{stats?.enrollmentStats.newEnrollments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Average Enrollments per Student:</span>
              <span>
                {stats && Math.round((stats.enrollmentStats.totalEnrollments / stats.userStats.totalStudents) * 10) / 10}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-surface p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/users" 
            className="bg-surface-light hover:bg-primary/20 p-4 rounded-lg text-center transition-colors"
          >
            <span className="block text-2xl mb-2">👥</span>
            <span>Manage Users</span>
          </Link>
          <Link 
            to="/admin/courses" 
            className="bg-surface-light hover:bg-primary/20 p-4 rounded-lg text-center transition-colors"
          >
            <span className="block text-2xl mb-2">📚</span>
            <span>All Courses</span>
          </Link>
          <Link 
            to="/admin/analytics" 
            className="bg-surface-light hover:bg-primary/20 p-4 rounded-lg text-center transition-colors"
          >
            <span className="block text-2xl mb-2">📈</span>
            <span>Analytics</span>
          </Link>
          <Link 
            to="/admin/settings" 
            className="bg-surface-light hover:bg-primary/20 p-4 rounded-lg text-center transition-colors"
          >
            <span className="block text-2xl mb-2">⚙️</span>
            <span>System Settings</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="bg-surface p-6 rounded-lg">
        <div className="space-y-4">
          <div className="pb-3 border-b border-surface-light">
            <div className="flex justify-between">
              <span className="font-medium">New teacher account created</span>
              <span className="text-xs text-text-secondary">2 hours ago</span>
            </div>
            <p className="text-text-secondary mt-1">Teacher: John Smith</p>
          </div>
          <div className="pb-3 border-b border-surface-light">
            <div className="flex justify-between">
              <span className="font-medium">New course published</span>
              <span className="text-xs text-text-secondary">Yesterday</span>
            </div>
            <p className="text-text-secondary mt-1">Course: Advanced JavaScript Patterns</p>
          </div>
          <div className="pb-3 border-b border-surface-light">
            <div className="flex justify-between">
              <span className="font-medium">System update completed</span>
              <span className="text-xs text-text-secondary">3 days ago</span>
            </div>
            <p className="text-text-secondary mt-1">Updated to version 2.3.0</p>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="font-medium">Bulk enrollment completed</span>
              <span className="text-xs text-text-secondary">5 days ago</span>
            </div>
            <p className="text-text-secondary mt-1">25 students enrolled in Web Development Fundamentals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 