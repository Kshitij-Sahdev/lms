import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserRole } from '@/types';
import useAuth from '@/hooks/useAuth';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean; // Default true
  layout?: boolean; // Wrap in layout? Default true
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  layout = true,
}: ProtectedRouteProps) => {
  const { userData, loading } = useAuth();
  const location = useLocation();
  
  // If we're still loading, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check role access if roles are specified
  const hasRequiredRole = allowedRoles.length === 0 || 
    (userData && allowedRoles.includes(userData.role as UserRole));
  
  // Wrap content based on authentication status
  const content = (
    <>
      <SignedIn>
        {/* If user has the required role, or no role restriction */}
        {hasRequiredRole ? (
          layout ? <Layout>{children}</Layout> : children
        ) : (
          <Navigate 
            to="/unauthorized" 
            state={{ from: location }} 
            replace 
          />
        )}
      </SignedIn>
      
      <SignedOut>
        {requireAuth ? (
          <Navigate 
            to="/" 
            state={{ from: location }} 
            replace 
          />
        ) : (
          children
        )}
      </SignedOut>
    </>
  );
  
  return content;
};

export default ProtectedRoute; 