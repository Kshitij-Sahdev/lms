import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';

// Check if we're in dev mode
const isDevelopmentMode = import.meta.env.VITE_DEVELOPMENT_MODE === 'true';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Development mode mock login
  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // For development, just redirect to student dashboard
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      navigate('/student');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // If in development mode, show mock login form
  if (isDevelopmentMode) {
    return (
      <div className="auth-form">
        <h2 className="text-xl font-semibold mb-4">Sign In (Development Mode)</h2>
        
        {error && (
          <div className="bg-error/20 text-error p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleMockLogin}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-text-secondary mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-text-secondary mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white p-3 rounded font-medium transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Regular Clerk authentication in production mode
  return (
    <div className="auth-form">
      <SignIn 
        routing="path" 
        path="/login" 
        signUpUrl="/register"
        afterSignInUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            card: "bg-transparent shadow-none",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-text-secondary",
            formButtonPrimary: "bg-primary hover:bg-primary-dark",
            formFieldInput: "bg-surface-light border-surface-light text-white",
            formFieldLabel: "text-text-secondary",
            footerActionLink: "text-primary hover:text-primary-dark",
          }
        }}
      />
    </div>
  );
};

export default Login; 