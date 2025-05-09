import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, useUser } from '@clerk/clerk-react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

interface SidebarLink {
  title: string;
  icon: string;
  path: string;
}

const studentLinks: SidebarLink[] = [
  { title: 'Dashboard', icon: '📊', path: '/dashboard' },
  { title: 'My Courses', icon: '📚', path: '/courses' },
  { title: 'Assignments', icon: '📝', path: '/assignments' },
  { title: 'Calendar', icon: '📅', path: '/calendar' },
  { title: 'Notifications', icon: '🔔', path: '/notifications' },
];

const teacherLinks: SidebarLink[] = [
  { title: 'Dashboard', icon: '📊', path: '/teacher/dashboard' },
  { title: 'My Courses', icon: '📚', path: '/teacher/courses' },
  { title: 'Students', icon: '👨‍🎓', path: '/teacher/students' },
  { title: 'Assignments', icon: '📝', path: '/teacher/assignments' },
  { title: 'Schedule', icon: '📅', path: '/teacher/schedule' },
];

const adminLinks: SidebarLink[] = [
  { title: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
  { title: 'Users', icon: '👥', path: '/admin/users' },
  { title: 'Courses', icon: '📚', path: '/admin/courses' },
  { title: 'Reports', icon: '📈', path: '/admin/reports' },
  { title: 'Settings', icon: '⚙️', path: '/admin/settings' },
];

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  // Determine which links to show based on user role
  // This is just a placeholder logic - replace with your actual role logic
  const userRole = 'student'; // Replace with actual user role detection
  
  const sidebarLinks = userRole === 'admin' 
    ? adminLinks 
    : userRole === 'teacher' 
      ? teacherLinks 
      : studentLinks;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-background-main flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        <SignedIn>
          {/* Sidebar - hidden on mobile unless toggled */}
          <aside 
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-40 w-64 bg-background-paper shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto pt-16`}
          >
            {/* Sidebar content */}
            <div className="h-full flex flex-col py-4 overflow-y-auto">
              <div className="px-4 mb-6">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
              </div>
              
              <nav className="flex-1 px-2 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'bg-background-elevated text-primary'
                        : 'text-white hover:bg-background-elevated'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.title}
                  </Link>
                ))}
              </nav>
              
              <div className="p-4 mt-auto">
                <div className="glass rounded-lg p-4">
                  <h3 className="font-medium text-white">Need Help?</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Contact support for assistance with any issues.
                  </p>
                  <button className="mt-2 text-sm text-primary hover:text-primary-light">
                    Support Center
                  </button>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Mobile sidebar toggle button */}
          <button
            className="fixed bottom-4 left-4 z-50 lg:hidden p-3 rounded-full bg-primary shadow-lg"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </SignedIn>
        
        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 