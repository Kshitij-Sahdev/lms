import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import api from '@/utils/api';

interface UserData {
  id: string;
  role: UserRole;
  requires2FA: boolean;
  has2FAVerified: boolean;
}

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has completed 2FA
  const [has2FAVerified, setHas2FAVerified] = useState<boolean>(() => {
    const verified = localStorage.getItem('2fa_verified');
    return verified ? JSON.parse(verified) : false;
  });

  // Fetch user data from backend when Clerk user is loaded
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Call your backend API to get user data including role
        const response = await api.get<UserData>('/users/me');
        
        setUserData(response);
        
        // Check if 2FA verification is needed
        if (response.requires2FA && !has2FAVerified) {
          navigate('/two-factor-auth', { state: { redirectTo: window.location.pathname } });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user, has2FAVerified, navigate]);

  // Handle 2FA verification
  const set2FAVerified = (verified: boolean) => {
    localStorage.setItem('2fa_verified', JSON.stringify(verified));
    setHas2FAVerified(verified);
  };

  // Clear 2FA verification on sign out
  const handleSignOut = async () => {
    localStorage.removeItem('2fa_verified');
    localStorage.removeItem('authToken');
    await signOut();
    navigate('/');
  };

  return {
    user,
    userData,
    isLoaded,
    isSignedIn,
    loading,
    error,
    has2FAVerified,
    set2FAVerified,
    signOut: handleSignOut,
  };
};

export default useAuth; 