import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';

// AuthLayout serves as a container for authentication pages (login, register, etc.)
const AuthLayout = () => {
  useEffect(() => {
    console.log('AuthLayout mounted');
    // Force a rerender after a short delay in case of CSS issues
    const timer = setTimeout(() => {
      console.log('Forcing update to ensure visibility');
      const root = document.getElementById('root');
      if (root) {
        // Add a class to help debug visibility
        root.classList.add('auth-active');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 relative z-30 overflow-visible">
      {/* Background animation */}
      <BackgroundAnimation />
      
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <div className="text-center mb-8 z-50 relative">
        <h1 className="text-5xl font-bold text-primary animate-fade-in text-shadow">
          Knowledge Chakra
        </h1>
        <p className="text-text-secondary mt-2 text-xl animate-fade-in delay-100">
          Learning Management System
        </p>
      </div>
      
      <div className="w-full max-w-md transition-all duration-500 animate-fade-in delay-200 z-50 relative">
        <Outlet />
      </div>
      
      <div className="absolute bottom-4 text-text-secondary text-sm animate-fade-in delay-300 z-20">
        &copy; {new Date().getFullYear()} Knowledge Chakra. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout; 