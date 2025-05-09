import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 relative z-20">
      <div className="text-center mb-8 z-auth">
        <h1 className="text-5xl font-bold text-primary animate-fade-in text-shadow">
          Knowledge Chakra
        </h1>
        <p className="text-text-secondary mt-2 text-xl animate-fade-in delay-100">
          Learning Management System
        </p>
      </div>
      
      <div className="w-full max-w-md transition-all duration-500 animate-fade-in delay-200 z-auth">
        <Outlet />
      </div>
      
      <div className="absolute bottom-4 text-text-secondary text-sm animate-fade-in delay-300">
        &copy; {new Date().getFullYear()} Knowledge Chakra. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout; 