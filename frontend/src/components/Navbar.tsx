import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import theme from '../styles/theme';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background-paper border-b border-white/10 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-bold text-white">KC</span>
                </span>
                <span className="font-bold text-xl text-white">Knowledge Chakra</span>
              </Link>
            </div>
            
            {/* Desktop nav links */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <SignedIn>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-background-elevated transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/courses" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-background-elevated transition-colors"
                >
                  Courses
                </Link>
              </SignedIn>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            <SignedIn>
              {/* User dropdown */}
              <div className="ml-3 relative flex items-center gap-4">
                <span className="text-white text-sm hidden md:block">
                  {user?.firstName} {user?.lastName}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: '2rem',
                        height: '2rem',
                      }
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Link 
                to="/sign-in" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary hover:bg-background-elevated"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
          <SignedIn>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-background-elevated"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-background-elevated"
              onClick={closeMobileMenu}
            >
              Courses
            </Link>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 