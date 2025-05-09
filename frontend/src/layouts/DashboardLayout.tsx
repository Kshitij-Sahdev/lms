import { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  userRole: UserRole;
}

const DashboardLayout = ({ userRole }: DashboardLayoutProps) => {
  const location = useLocation();
  
  // Navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Dashboard', icon: '📊' },
    ];
    
    switch (userRole) {
      case UserRole.STUDENT:
        return [
          ...baseLinks,
          { to: '/student/courses', label: 'My Courses', icon: '📚' },
          { to: '/student/calendar', label: 'Calendar', icon: '📅' },
        ];
      case UserRole.TEACHER:
        return [
          ...baseLinks,
          { to: '/teacher/courses', label: 'Manage Courses', icon: '📚' },
          { to: '/teacher/assessments', label: 'Assessments', icon: '📝' },
          { to: '/teacher/live-classes', label: 'Live Classes', icon: '🎥' },
          { to: '/teacher/students', label: 'Students', icon: '👨‍🎓' },
        ];
      case UserRole.ADMIN:
        return [
          ...baseLinks,
          { to: '/admin/users', label: 'Manage Users', icon: '👥' },
          { to: '/admin/courses', label: 'All Courses', icon: '📚' },
          { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
          { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
        ];
      default:
        return baseLinks;
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface flex-shrink-0">
        <div className="p-4 flex items-center justify-between md:justify-center border-b border-surface-light">
          <h1 className="text-2xl font-bold text-primary">Knowledge Chakra</h1>
          <button className="md:hidden">
            <span className="sr-only">Menu</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-surface-light'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto border-t border-surface-light">
          <div className="flex items-center">
            <UserButton />
            <span className="ml-4 text-sm">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 