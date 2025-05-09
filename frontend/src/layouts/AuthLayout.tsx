import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glassmorphism p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Knowledge Chakra</h1>
          <p className="text-text-secondary mt-2">Learning Management System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 