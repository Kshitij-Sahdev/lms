import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import Input from '../../components/common/Input';
import { useToasts } from '../../components/common/Feedback';

// Check if we're in dev mode
const isDevelopmentMode = import.meta.env.VITE_DEVELOPMENT_MODE === 'true';

// Email icon
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

// Lock icon
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

// User icon
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToasts();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Development mode mock register
  const handleMockRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      showError((err as Error).message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // If in development mode, show mock register form
  if (isDevelopmentMode) {
    return (
      <div className="auth-form animate-fade-in">
        <div className="glass-card mb-8 animate-float">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Create your <span className="text-primary">Knowledge Chakra</span> account
          </h2>
          
          <form onSubmit={handleMockRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<UserIcon />}
                variant="glass"
                error={errors.firstName}
                required
              />
              
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                leftIcon={<UserIcon />}
                variant="glass"
                error={errors.lastName}
                required
              />
            </div>
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<EmailIcon />}
              variant="glass"
              error={errors.email}
              required
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<LockIcon />}
              variant="glass"
              error={errors.password}
              required
              helperText="Must be at least 8 characters"
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<LockIcon />}
              variant="glass"
              error={errors.confirmPassword}
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
        
        <div className="text-center animate-fade-in">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="animated-underline text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Regular Clerk authentication in production mode
  return (
    <div className="auth-form animate-fade-in">
      <div className="glass-card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create your <span className="text-primary">Knowledge Chakra</span> account
        </h2>
        
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          redirectUrl="/student"
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

export default Register; 