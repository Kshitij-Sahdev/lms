import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './styles/index.css'

// Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we're in dev mode with a valid clerk key
const isDevelopmentMode = import.meta.env.DEV && (!clerkPubKey || clerkPubKey === 'pk_test_placeholder')

// Create the app component with or without Clerk based on mode
const AppWithProviders = () => {
  // If we're in development mode and don't have a valid clerk key,
  // render without Clerk authentication for easier development
  if (isDevelopmentMode) {
    console.warn('Running in development mode without Clerk authentication. Sign-in functionality will be limited.')
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  }

  // Normal production mode with Clerk authentication
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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
