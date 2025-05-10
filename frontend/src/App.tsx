import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import AssessmentView from './pages/student/AssessmentView';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import ManageCourses from './pages/teacher/ManageCourses';
import ManageAssessments from './pages/teacher/ManageAssessments';
import ManageLiveClasses from './pages/teacher/ManageLiveClasses';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CreateUser from './pages/admin/CreateUser';

// Shared components
import NotFound from './pages/NotFound';
import Loading from './components/common/Loading';
import { ToastProvider } from './components/common/Feedback';

// Types
import { UserRole } from './types';
import api from './utils/api';

interface UserResponse {
  id: string;
  role: UserRole;
  requires2FA: boolean;
  email: string;
  firstName: string;
  lastName: string;
}

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      // Check for auth token in localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Set the token in the API utility
        api.setToken(token);
        
        // Call backend to get user data
        const userData = await api.get<UserResponse>('/users/me');
        
        if (userData) {
          setUserRole(userData.role);
          setUserId(userData.id);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Clear token if invalid
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <ToastProvider>
      <div className="relative z-10 min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="verify-2fa" element={<TwoFactorAuth />} />
          </Route>

          {/* Protected student routes */}
          <Route
            path="/student/*"
            element={
              isAuthenticated && userRole === UserRole.STUDENT ? (
                <DashboardLayout userRole={UserRole.STUDENT} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="assessments/:assessmentId" element={<AssessmentView />} />
          </Route>

          {/* Protected teacher routes */}
          <Route
            path="/teacher/*"
            element={
              isAuthenticated && userRole === UserRole.TEACHER ? (
                <DashboardLayout userRole={UserRole.TEACHER} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="assessments" element={<ManageAssessments />} />
            <Route path="live-classes" element={<ManageLiveClasses />} />
          </Route>

          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated && userRole === UserRole.ADMIN ? (
                <DashboardLayout userRole={UserRole.ADMIN} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="users/create" element={<CreateUser />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
