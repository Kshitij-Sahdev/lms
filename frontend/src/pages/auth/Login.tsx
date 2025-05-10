import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import Input from '../../components/common/Input';
import { useToasts } from '../../components/common/Feedback';

// Check if we're in dev mode
const isDevelopmentMode = import.meta.env.VITE_DEVELOPMENT_MODE === 'true';

// Email icon SVG
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

// Lock icon SVG
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToasts();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Log debug information
  useEffect(() => {
    console.log('Login component mounted');
    console.log('isDevelopmentMode:', isDevelopmentMode);
    console.log('VITE_DEVELOPMENT_MODE:', import.meta.env.VITE_DEVELOPMENT_MODE);
  }, []);

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

      // Call the password-login endpoint for both admin and development mode
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Check if baseUrl already includes /api prefix
      const apiPrefix = baseUrl.includes('/api') ? '' : '/api';
      
      const response = await fetch(`${baseUrl}${apiPrefix}/auth/password-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage for future API calls
      localStorage.setItem('token', data.token);
      
      success('Login successful! Welcome back.');

      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError((err as Error).message);
      showError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // If in development mode, show mock login form
  if (isDevelopmentMode) {
    console.log('Rendering development login form');
    return (
      <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
        <div className="glass-card mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Sign in to <span className="text-primary">Knowledge Chakra</span>
          </h2>
          
          <form onSubmit={handleMockLogin} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<EmailIcon />}
              required
              variant="glass"
              error={error && !email ? 'Email is required' : ''}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<LockIcon />}
              required
              variant="glass"
              error={error && !password ? 'Password is required' : ''}
            />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-3.5 w-3.5 rounded-sm border-gray-600 bg-gray-800 text-primary focus:ring-1 focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-gray-400">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-primary hover:text-primary-light">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center mt-2">
              <p className="text-xs text-white/70">
                Use any email with "admin" for admin access, "teacher" for teacher access, or any other email for student access
              </p>
            </div>
          </form>
        </div>
        
        <div className="text-center animate-fade-in">
          <p className="text-xs text-text-muted mt-2">Development mode active</p>
        </div>
      </div>
    );
  }

  console.log('Rendering Clerk login form');
  // Regular Clerk authentication in production mode
  return (
    <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
      <div className="glass-card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Sign in to <span className="text-primary">Knowledge Chakra</span>
        </h2>
        
        <SignIn 
          routing="path" 
          path="/login" 
          redirectUrl="/student"
          afterSignInUrl="/student"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-text-secondary",
              formButtonPrimary: "bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-all",
              formFieldInput: "bg-background-elevated border-background-paper/50 text-white rounded-xl p-3",
              formFieldLabel: "text-text-secondary",
              footerActionLink: "text-primary hover:text-primary-light",
              dividerLine: "bg-white/10",
              dividerText: "text-text-secondary",
              socialButtonsBlockButton: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login; 