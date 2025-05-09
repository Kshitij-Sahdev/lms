// Theme configuration for Knowledge Chakra
// This file contains all the colors used throughout the application
// Changing colors here will update the entire application

export const colors = {
  // Main colors
  primary: {
    main: '#FF6B00', // Orange
    light: '#FF8A3D',
    dark: '#CC5500',
  },
  
  // Background colors (dark mode)
  background: {
    main: '#121212',
    paper: '#1E1E1E',
    elevated: '#2D2D2D',
    card: 'rgba(30, 30, 30, 0.7)', // For glassmorphism
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    disabled: '#666666',
    highlight: '#FF6B00', // Same as primary.main
  },
  
  // UI Element colors
  border: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.08)',
  
  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Glassmorphism effect
  glass: {
    background: 'rgba(18, 18, 18, 0.7)',
    border: 'rgba(255, 255, 255, 0.05)',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    blur: '10px',
  },
};

// Typography
export const typography = {
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

// Animations
export const animations = {
  transition: {
    fast: '0.15s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
};

// Border radius
export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '2rem',
  full: '9999px',
};

// Z-index
export const zIndex = {
  base: 0,
  elevated: 10,
  dropdown: 100,
  sticky: 200,
  drawer: 300,
  modal: 400,
  popover: 500,
  toast: 600,
};

// Exports all theme elements
export const theme = {
  colors,
  typography,
  spacing,
  animations,
  shadows,
  borderRadius,
  zIndex,
};

export default theme; 