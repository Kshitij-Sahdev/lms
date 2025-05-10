import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

interface TwoFactorAuthProps {
  email?: string;
}

const TwoFactorAuth = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the email and redirectPath from location state
  const email = (location.state as { email?: string })?.email || '';
  const redirectPath = (location.state as { from?: string })?.from || '/student';
  
  // References for input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  
  // Effect to focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  // Effect to manage countdown timer for resend button
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [countdown]);
  
  // Send 2FA code to user's email
  const sendVerificationCode = async () => {
    if (!email) {
      setError('Email address is missing. Please go back to login.');
      return;
    }
    
    try {
      setResendDisabled(true);
      setCountdown(60); // 60 second cooldown
      
      await api.post('/auth/2fa/send', { email });
      
      toast.success('Verification code sent to your email');
    } catch (err) {
      toast.error('Failed to send verification code');
      setResendDisabled(false);
      setCountdown(0);
    }
  };
  
  // Handle input change for verification code
  const handleInputChange = (index: number, value: string) => {
    // Only accept numbers
    if (value !== '' && !/^\d+$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto focus next input
    if (value !== '' && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  // Handle keydown events for navigation between inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };
  
  // Handle submission of 2FA code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email address is missing. Please go back to login.');
      return;
    }
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/2fa/verify', {
        email,
        code: verificationCode,
      });
      
      toast.success('Verification successful');
      
      // Store authentication token
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        
        // Navigate to the appropriate dashboard based on the user's role
        if (response.user?.role) {
          navigate(`/${response.user.role}`);
        } else {
          navigate(redirectPath);
        }
      } else {
        setError('Verification succeeded but no token received');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Request a verification code on component mount
  useEffect(() => {
    if (email) {
      sendVerificationCode();
    }
  }, [email]);
  
  if (!email) {
    return (
      <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
        <div className="glass-card">
          <h2 className="text-2xl font-bold mb-2 text-center text-white">Error</h2>
          <p className="text-text-secondary text-center mb-6">
            No email address provided. Please return to the login page.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
      <div className="glass-card">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">Two-Factor Authentication</h2>
        <p className="text-text-secondary text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4 text-sm text-white">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                id={`code-${index}`}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center bg-background-elevated border border-white/10 rounded-lg text-lg text-white focus:border-primary focus:ring-1 focus:ring-primary"
                maxLength={1}
                disabled={loading}
              />
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={resendDisabled}
              className="text-sm text-primary hover:text-primary-light disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {resendDisabled
                ? `Resend code in ${countdown}s`
                : 'Didn\'t receive the code? Resend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth; 