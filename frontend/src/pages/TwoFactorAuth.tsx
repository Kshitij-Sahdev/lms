import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TwoFactorAuth = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();
  
  const redirectPath = location.state?.redirectTo || '/dashboard';
  
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/');
    } else if (isLoaded && user) {
      // Send 2FA code on first load
      sendVerificationCode();
    }
  }, [isLoaded, user, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (requestSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [requestSent, countdown]);

  const sendVerificationCode = async () => {
    if (!user || !user.emailAddresses[0].emailAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/2fa/send`, {
        email: user.emailAddresses[0].emailAddress,
      });
      
      setRequestSent(true);
      setCountdown(60);
      toast.success('Verification code sent to your email');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only accept numbers
    if (value !== '' && !/^\d+$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.emailAddresses[0].emailAddress) return;
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/2fa/verify`, {
        email: user.emailAddresses[0].emailAddress,
        code: verificationCode,
      });
      
      if (response.data.success) {
        toast.success('Verification successful');
        // Store the authentication token if needed
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        navigate(redirectPath);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-main flex items-center justify-center px-4">
      <div className="card-glass max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Two-Factor Authentication</h2>
        
        <p className="text-center mb-6">
          A verification code has been sent to your email.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold rounded-md bg-background-paper border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 rounded-md p-3 mb-4">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400 mb-2">Didn't receive the code?</p>
          <button
            onClick={sendVerificationCode}
            disabled={loading || (requestSent && countdown > 0)}
            className="text-primary hover:text-primary-light text-sm"
          >
            {requestSent && countdown > 0
              ? `Resend code (${countdown}s)`
              : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth; 