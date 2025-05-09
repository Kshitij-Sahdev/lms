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

      // For development, just redirect to student dashboard
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      success('Login successful! Welcome back.');
      navigate('/student');
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
        <div className="glass-card mb-8 animate-float">
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
                  className="rounded bg-background-elevated border-background-paper text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-text-secondary">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-primary hover:text-primary-light">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="text-center animate-fade-in">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="animated-underline text-primary">
              Sign up
            </Link>
          </p>
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
          signUpUrl="/register"
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
            }
          }}
          localization={{
            socialButtonsBlockButton: {
              google: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login; 