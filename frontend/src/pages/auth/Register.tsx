import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';

// Check if we're in dev mode with a valid clerk key
const isDevelopmentMode = import.meta.env.DEV && 
  (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder');

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Development mode mock registration
  const handleMockRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Please fill out all fields');
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // For development, just redirect to verify email page
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      navigate('/verify-email');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // If in development mode, show mock registration form
  if (isDevelopmentMode) {
    return (
      <div className="auth-form">
        <h2 className="text-xl font-semibold mb-4">Create Account (Development Mode)</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleMockRegister}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label 
                htmlFor="firstName" 
                className="block text-text-secondary mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded bg-background-elevated border border-background-paper text-text-primary focus:border-primary"
                placeholder="First Name"
              />
            </div>
            
            <div>
              <label 
                htmlFor="lastName" 
                className="block text-text-secondary mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded bg-background-elevated border border-background-paper text-text-primary focus:border-primary"
                placeholder="Last Name"
              />
            </div>
          </div>
          
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-background-elevated border border-background-paper text-text-primary focus:border-primary"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-background-elevated border border-background-paper text-text-primary focus:border-primary"
              placeholder="Create a password"
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-text-secondary mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded bg-background-elevated border border-background-paper text-text-primary focus:border-primary"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-text-primary p-3 rounded font-medium transition-colors"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Regular Clerk authentication in production mode
  return (
    <div className="auth-form">
      <SignUp 
        routing="path" 
        path="/register" 
        signInUrl="/login"
        afterSignUpUrl="/verify-email"
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

export default Register; 