import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './styles/index.css'
import { MockAuthProvider } from './context/DevelopmentAuthContext'

// Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we're in dev mode with a valid clerk key
const isDevelopmentMode = import.meta.env.VITE_DEVELOPMENT_MODE === 'true'

// Create the app component with or without Clerk based on mode
const AppWithProviders = () => {
  // If we're in development mode and don't have a valid clerk key,
  // render without Clerk authentication for easier development
  if (isDevelopmentMode) {
    console.warn('Running in development mode without Clerk authentication. Sign-in functionality will be limited.')
    return (
      <BrowserRouter>
        <MockAuthProvider>
          <App />
        </MockAuthProvider>
      </BrowserRouter>
    )
  }

  // Normal production mode with Clerk authentication
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      navigate={(to) => window.location.href = to}
      appearance={{
        elements: {
          rootBox: "mx-auto w-full",
          card: "bg-background-paper/40 backdrop-blur-glass border border-white/10 shadow-glass p-6 rounded-2xl",
          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-text-secondary",
          formButtonPrimary: "bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-all",
          formFieldInput: "bg-surface-light border-surface-light text-white rounded-xl p-3",
          formFieldLabel: "text-text-secondary",
          footerActionLink: "text-primary hover:text-primary-light",
          socialButtonsBlockButton: "border border-white/10 bg-background-elevated hover:bg-background-paper transition-all rounded-xl"
        }
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>,
)
