import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, passwordLength: password.length });
      
      // Prepare credentials
      const credentials = {
        email,
        password
      };

      // Call the password-login endpoint
      console.log('Sending request to /auth/password-login');
      const response = await api.post('/auth/password-login', credentials);
      
      console.log('Login response received:', response);
      
      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);
        
        // Always mark 2FA as verified
        if (response.user && response.user.id) {
          localStorage.setItem(`2fa_verified_${response.user.id}`, 'true');
        }
        
        // Show success message
        toast.success('Login successful!');
        console.log('Login successful, redirecting based on role:', response.user?.role);

        // Redirect based on user role
        if (response.user?.role === 'admin') {
          navigate('/admin');
        } else if (response.user?.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
      } else {
        setError('Invalid response from server.');
        console.error('Unexpected response format:', response);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
      <div className="glass-card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Sign in to <span className="text-primary">Knowledge Chakra</span>
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-white/80">
              Email
            </label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-background-elevated border border-white/10 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-white/80">
              Password
            </label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-background-elevated border border-white/10 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 