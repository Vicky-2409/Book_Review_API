// src/components/common/Alert.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  className,
  onClose,
}) => {
  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  };

  const alertStyles = twMerge(
    'border-l-4 p-4 mb-4 rounded',
    typeStyles[type],
    className
  );

  return (
    <div className={alertStyles} role="alert">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close alert"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;