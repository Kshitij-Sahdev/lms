import React, { useState, forwardRef, InputHTMLAttributes } from 'react';
import { InputFeedback } from './Feedback';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  labelClassName?: string;
  containerClassName?: string;
  wrapperClassName?: string;
  iconContainerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isLoading,
  variant = 'default',
  size = 'md',
  id,
  className = '',
  labelClassName = '',
  containerClassName = '',
  wrapperClassName = '',
  iconContainerClassName = '',
  disabled,
  required,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!rest.value || !!rest.defaultValue);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (rest.onFocus) rest.onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (rest.onBlur) rest.onBlur(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (rest.onChange) rest.onChange(e);
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-1.5 px-3 text-sm';
      case 'lg': return 'py-3 px-4 text-lg';
      case 'md':
      default: return 'py-2.5 px-4';
    }
  };
  
  // Determine input variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-input backdrop-blur-md bg-background-paper/80';
      case 'minimal':
        return 'bg-transparent border-b border-t-0 border-x-0 rounded-none px-0 focus:border-b-primary';
      case 'default':
      default:
        return 'bg-background-elevated border border-background-paper/50 hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-inner-glow';
    }
  };
  
  // Determine icon spacing
  const getIconPaddingClass = () => {
    const padding = [];
    if (leftIcon) padding.push(size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-12' : 'pl-10');
    if (rightIcon || isLoading) padding.push(size === 'sm' ? 'pr-8' : size === 'lg' ? 'pr-12' : 'pr-10');
    return padding.join(' ');
  };
  
  // Get conditional classes for active states
  const getStateClasses = () => {
    const classes = [];
    
    if (error) {
      classes.push('border-error/50 focus:border-error focus:ring-error');
    }
    
    if (disabled) {
      classes.push('opacity-60 cursor-not-allowed');
    }
    
    return classes.join(' ');
  };
  
  // Get classes for the input
  const inputClasses = [
    'w-full outline-none transition-all duration-300 rounded-xl',
    getSizeClasses(),
    getVariantClasses(),
    getIconPaddingClass(),
    getStateClasses(),
    className
  ].join(' ');
  
  return (
    <div className={`form-control ${error ? 'form-control-error' : ''} ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`text-text-secondary font-medium mb-1.5 inline-block transition-all ${isFocused ? 'text-primary' : ''} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className={`relative ${wrapperClassName}`}>
        {leftIcon && (
          <div className={`absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary ${iconContainerClassName}`}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          disabled={disabled || isLoading}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          required={required}
          {...rest}
        />
        
        {(rightIcon || isLoading) && (
          <div className={`absolute inset-y-0 right-0 flex items-center pr-3 ${iconContainerClassName}`}>
            {isLoading ? (
              <div className="animate-spin h-5 w-5">
                <svg className="text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : rightIcon}
          </div>
        )}
        
        {variant === 'minimal' && (
          <div 
            className={`absolute bottom-0 left-0 h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 origin-left ${isFocused ? 'scale-x-100' : ''}`} 
          />
        )}
      </div>
      
      {error ? (
        <InputFeedback message={error} type="error" />
      ) : helperText ? (
        <div id={`${id}-helper`} className="text-text-secondary text-sm mt-1">
          {helperText}
        </div>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 