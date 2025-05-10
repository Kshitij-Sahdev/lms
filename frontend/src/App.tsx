import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useMockAuth } from './context/DevelopmentAuthContext';

// Conditionally import useAuth to prevent errors in development mode
let useAuth;
const isDevelopmentMode = import.meta.env.VITE_DEVELOPMENT_MODE === 'true';
if (!isDevelopmentMode) {
  // Only import and use Clerk's useAuth in production mode
  useAuth = require('@clerk/clerk-react').useAuth;
}

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

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

function App() {
  // Use the appropriate auth mechanism based on mode
  const auth = isDevelopmentMode ? useMockAuth() : useAuth();
  
  // Extract needed properties
  const { isLoaded, userId, getToken } = auth;
  
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isDevelopmentMode) {
        // In development mode without Clerk, use a mock student role
        setUserRole(UserRole.STUDENT);
        setIsLoading(false);
        return;
      }

      if (!isLoaded || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, userId, getToken]);

  if (!isDevelopmentMode && (!isLoaded || isLoading)) {
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
          </Route>

          {/* Protected student routes */}
          <Route
            path="/student/*"
            element={
              isDevelopmentMode || (userId && userRole === UserRole.STUDENT) ? (
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
              isDevelopmentMode || (userId && userRole === UserRole.TEACHER) ? (
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
              isDevelopmentMode || (userId && userRole === UserRole.ADMIN) ? (
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
