import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // This is a placeholder for the actual verification logic
      // In a real implementation, you would call your API endpoint
      // that verifies the email with the provided code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login after successful verification
      navigate('/login');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
      <p className="text-text-secondary mb-6">
        Please enter the verification code sent to your email.
      </p>
      
      {error && (
        <div className="bg-error/20 text-error p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="code" 
            className="block text-text-secondary mb-2"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
            placeholder="Enter verification code"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white p-3 rounded font-medium transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => {/* Resend code logic */}}
          className="text-primary hover:text-primary-dark"
        >
          Resend verification code
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail; 