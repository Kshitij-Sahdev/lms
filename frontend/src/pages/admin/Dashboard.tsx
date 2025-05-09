import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { User } from '@/types';
import { getUserStats, getRecentUsers } from '@/utils/userService';

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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    userStats: {
      totalUsers: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalAdmins: 0,
      newUsers: 0,
    },
    courseStats: {
      totalCourses: 0,
      totalPublishedCourses: 0,
    },
    enrollmentStats: {
      totalEnrollments: 0,
      newEnrollments: 0,
    }
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics
        const statsData = await getUserStats();
        setStats(statsData);
        
        // Fetch recent users
        const usersData = await getRecentUsers();
        setRecentUsers(usersData.users || []);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/users/new" className="btn btn-outline">
            Add User
          </Link>
          <Link to="/admin/settings" className="btn btn-primary">
            Settings
          </Link>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Users" 
              value={stats.userStats.totalUsers} 
              icon="👥" 
              change={5}
            />
            <StatsCard 
              title="Active Courses" 
              value={stats.courseStats.totalPublishedCourses} 
              icon="📚" 
              change={12}
            />
            <StatsCard 
              title="Total Enrollments" 
              value={stats.enrollmentStats.totalEnrollments} 
              icon="📝" 
              change={8}
            />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User stats section */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Distribution</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Students</span>
              <span className="text-white font-medium">{stats.userStats.totalStudents}</span>
            </div>
            <div className="w-full bg-background-elevated rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(stats.userStats.totalStudents / stats.userStats.totalUsers) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Teachers</span>
              <span className="text-white font-medium">{stats.userStats.totalTeachers}</span>
            </div>
            <div className="w-full bg-background-elevated rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${(stats.userStats.totalTeachers / stats.userStats.totalUsers) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Admins</span>
              <span className="text-white font-medium">{stats.userStats.totalAdmins}</span>
            </div>
            <div className="w-full bg-background-elevated rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(stats.userStats.totalAdmins / stats.userStats.totalUsers) * 100}%` }}
              ></div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-background-elevated text-center">
              <Link to="/admin/users" className="text-primary hover:text-primary-light">
                View All Users
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent users */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Users</h2>
            <Link to="/admin/users" className="text-primary hover:text-primary-light text-sm">
              View All
            </Link>
          </div>
          
          {recentUsers.length > 0 ? (
            <div>
              {recentUsers.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">No recent users found.</p>
          )}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="mt-8 card-glass p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/users" className="card p-4 hover:bg-background-elevated transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-medium text-white">Manage Users</h3>
            <p className="text-sm text-gray-400 mt-1">Add, edit, or manage user accounts</p>
          </Link>
          
          <Link to="/admin/courses" className="card p-4 hover:bg-background-elevated transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-medium text-white">Manage Courses</h3>
            <p className="text-sm text-gray-400 mt-1">View and manage all platform courses</p>
          </Link>
          
          <Link to="/admin/analytics" className="card p-4 hover:bg-background-elevated transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-white">Analytics</h3>
            <p className="text-sm text-gray-400 mt-1">View platform performance metrics</p>
          </Link>
          
          <Link to="/admin/settings" className="card p-4 hover:bg-background-elevated transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-medium text-white">Settings</h3>
            <p className="text-sm text-gray-400 mt-1">Configure platform settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 