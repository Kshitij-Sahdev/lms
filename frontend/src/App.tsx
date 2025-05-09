import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { UserRole } from './types';

// Import pages
import TwoFactorAuth from './pages/TwoFactorAuth';
import StudentDashboard from './pages/student/Dashboard';

// Import components
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components
const Home = () => (
  <div className="min-h-screen bg-background-main flex flex-col items-center justify-center p-4">
    <div className="card-glass max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Knowledge Chakra</h1>
      <p className="text-xl mb-8">Your Learning Management System</p>
      <p className="mb-4">Welcome to Knowledge Chakra, a modern Learning Management System built with the MERN stack.</p>
      <div className="flex gap-4 justify-center mt-6">
        <button className="btn btn-primary">Get Started</button>
        <button className="btn btn-outline">Learn More</button>
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <p className="text-gray-400">You have no courses yet.</p>
        <button className="btn btn-primary mt-4">Browse Courses</button>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <p className="text-gray-400">No upcoming events.</p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <p className="text-gray-400">No new notifications.</p>
      </div>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen bg-background-main flex items-center justify-center">
    <div className="card text-center max-w-lg">
      <h1 className="text-4xl font-bold text-primary mb-4">403</h1>
      <p className="text-xl mb-8">Access Denied</p>
      <p className="mb-6">You don't have permission to access this page.</p>
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-background-main flex items-center justify-center">
    <div className="card text-center max-w-lg">
      <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1E1E1E',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          
          {/* 2FA Verification Route */}
          <Route 
            path="/two-factor-auth" 
            element={
              <ProtectedRoute layout={false}>
                <TwoFactorAuth />
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Only accessible when signed in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Student routes */}
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]}>
                <div>Student Courses Page</div>
              </ProtectedRoute>
            }
          />
          
          {/* Teacher routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]}>
                <div>Teacher Dashboard</div>
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
          
          {/* Unauthorized page */}
          <Route 
            path="/unauthorized" 
            element={
              <>
                <Navbar />
                <Unauthorized />
              </>
            }
          />
          
          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <>
                <Navbar />
                <NotFound />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
