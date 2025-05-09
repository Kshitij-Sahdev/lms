import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Icons (inline SVG for simplicity)
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackProps {
  message: string;
  type?: FeedbackType;
  duration?: number;
  isVisible?: boolean;
  onClose?: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  showIcon?: boolean;
  showCloseButton?: boolean;
}

export const Toast: React.FC<FeedbackProps> = ({
  message,
  type = 'info',
  duration = 5000,
  isVisible = true,
  onClose,
  position = 'top-right',
  showIcon = true,
  showCloseButton = true,
}) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);
  
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);
  
  if (!visible) return null;
  
  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': default: return <InfoIcon />;
    }
  };
  
  // Determine position class
  const getPositionClass = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };
  
  // Determine color class based on type
  const getColorClass = () => {
    switch (type) {
      case 'success': return 'bg-success/10 text-success border-success/30';
      case 'error': return 'bg-error/10 text-error border-error/30';
      case 'warning': return 'bg-warning/10 text-warning border-warning/30';
      case 'info': default: return 'bg-info/10 text-info border-info/30';
    }
  };
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  return createPortal(
    <div
      className={`fixed ${getPositionClass()} z-50 min-w-[300px] max-w-md glass border animate-bounce-in`}
      role="alert"
    >
      <div className={`p-4 rounded-xl flex items-start gap-3 ${getColorClass()}`}>
        {showIcon && <div className="flex-shrink-0">{getIcon()}</div>}
        <div className="flex-grow">{message}</div>
        {showCloseButton && (
          <button 
            onClick={handleClose}
            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity ml-auto -mr-1"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

interface InputFeedbackProps {
  message: string;
  type?: FeedbackType;
}

export const InputFeedback: React.FC<InputFeedbackProps> = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  return (
    <div className={`text-${type} text-sm mt-1 animate-slide-down flex items-center gap-1.5`}>
      {type === 'error' && <ErrorIcon />}
      {type === 'warning' && <WarningIcon />}
      {type === 'info' && <InfoIcon />}
      {message}
    </div>
  );
};

// Toast container for multiple toasts
export const ToastContainer: React.FC<{
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  children: React.ReactNode;
}> = ({ position = 'top-right', children }) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-right': return 'top-0 right-0 pt-4 pr-4';
      case 'top-center': return 'top-0 left-1/2 transform -translate-x-1/2 pt-4';
      case 'bottom-right': return 'bottom-0 right-0 pb-4 pr-4';
      case 'bottom-center': return 'bottom-0 left-1/2 transform -translate-x-1/2 pb-4';
      default: return 'top-0 right-0 pt-4 pr-4';
    }
  };
  
  return createPortal(
    <div className={`fixed ${getPositionClass()} z-50 flex flex-col gap-2`}>
      {children}
    </div>,
    document.body
  );
};

// Global toast function
let toastIdCounter = 0;
export type ToastOptions = Omit<FeedbackProps, 'message' | 'isVisible' | 'onClose'>;

interface ToastManagerState {
  toasts: Array<FeedbackProps & { id: number }>;
}

class ToastManager {
  private state: ToastManagerState = {
    toasts: [],
  };
  private listeners: Set<() => void> = new Set();
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
  
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  getState() {
    return this.state;
  }
  
  toast(message: string, options: ToastOptions = {}) {
    const id = toastIdCounter++;
    const newToast = {
      id,
      message,
      isVisible: true,
      onClose: () => this.removeToast(id),
      ...options,
    };
    
    this.state = {
      toasts: [...this.state.toasts, newToast],
    };
    
    this.notifyListeners();
    return id;
  }
  
  removeToast(id: number) {
    this.state = {
      toasts: this.state.toasts.filter(toast => toast.id !== id),
    };
    
    this.notifyListeners();
  }
  
  // Convenience methods
  success(message: string, options: ToastOptions = {}) {
    return this.toast(message, { type: 'success', ...options });
  }
  
  error(message: string, options: ToastOptions = {}) {
    return this.toast(message, { type: 'error', ...options });
  }
  
  warning(message: string, options: ToastOptions = {}) {
    return this.toast(message, { type: 'warning', ...options });
  }
  
  info(message: string, options: ToastOptions = {}) {
    return this.toast(message, { type: 'info', ...options });
  }
}

// Create a singleton instance
export const toastManager = new ToastManager();

// React hook for toasts
export const useToasts = () => {
  const [state, setState] = useState(toastManager.getState());
  
  useEffect(() => {
    const unsubscribe = toastManager.subscribe(() => {
      setState(toastManager.getState());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    toasts: state.toasts,
    toast: toastManager.toast.bind(toastManager),
    success: toastManager.success.bind(toastManager),
    error: toastManager.error.bind(toastManager),
    warning: toastManager.warning.bind(toastManager),
    info: toastManager.info.bind(toastManager),
    removeToast: toastManager.removeToast.bind(toastManager),
  };
};

// Global ToastProvider component
export const ToastProvider: React.FC<{ 
  children: React.ReactNode; 
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}> = ({ children, position = 'top-right' }) => {
  const { toasts } = useToasts();
  
  // Add debug logging
  console.log('ToastProvider rendered', { toastsCount: toasts.length });
  
  return (
    <>
      {children}
      <ToastContainer position={position}>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </>
  );
}; 