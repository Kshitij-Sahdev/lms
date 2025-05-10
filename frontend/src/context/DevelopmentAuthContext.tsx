import React, { createContext, useContext, ReactNode } from 'react';

// Create a mock auth context that mimics Clerk's useAuth hook
interface MockAuthContextProps {
  isLoaded: boolean;
  userId: string | null;
  isSignedIn: boolean;
  sessionId: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddresses: { emailAddress: string }[];
  } | null;
  getToken: () => Promise<string>;
  signOut: () => Promise<void>;
}

const MockAuthContext = createContext<MockAuthContextProps>({
  isLoaded: true,
  userId: 'dev-user-123',
  isSignedIn: true,
  sessionId: 'dev-session-123',
  user: {
    id: 'dev-user-123',
    firstName: 'Dev',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'dev-user@example.com' }],
  },
  getToken: () => Promise.resolve('mock-token-for-development'),
  signOut: () => Promise.resolve(),
});

interface MockAuthProviderProps {
  children: ReactNode;
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  const mockAuthValue: MockAuthContextProps = {
    isLoaded: true,
    userId: 'dev-user-123',
    isSignedIn: true,
    sessionId: 'dev-session-123',
    user: {
      id: 'dev-user-123',
      firstName: 'Dev',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'dev-user@example.com' }],
    },
    getToken: () => {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      return Promise.resolve(token || 'mock-token-for-development');
    },
    signOut: () => {
      // Clear token on signout
      localStorage.removeItem('token');
      return Promise.resolve();
    },
  };

  return (
    <MockAuthContext.Provider value={mockAuthValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(MockAuthContext); 