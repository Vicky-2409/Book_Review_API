// src/components/common/Button.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none';
  
  // Variant specific styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:ring focus:ring-blue-300',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring focus:ring-gray-200',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus:ring focus:ring-red-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring focus:ring-gray-200',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring focus:ring-gray-200',
  };
  
  // Size specific styles
  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1.5 rounded',
    sm: 'text-sm px-3 py-2 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-6 py-3 rounded-lg',
  };
  
  // Conditional styles
  const disabledStyles = 'opacity-60 cursor-not-allowed';
  const loadingStyles = 'relative !text-transparent';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    (isLoading || disabled) ? disabledStyles : '',
    isLoading ? loadingStyles : '',
    className
  );
  
  // Button content with loading spinner overlay
  return (
    <button
      className={buttonStyles}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Loading spinner overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      
      {/* Left icon */}
      {leftIcon && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>}
      
      {/* Main content (text remains in the DOM but is invisible during loading) */}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      
      {/* Right icon */}
      {rightIcon && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>}
    </button>
  );
};

export default Button;