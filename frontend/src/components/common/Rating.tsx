// src/components/common/Rating.tsx
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  showValue?: boolean;
  color?: 'yellow' | 'blue' | 'pink' | 'purple';
  label?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  editable = false,
  onChange,
  className,
  showValue = false,
  color = 'yellow',
  label,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Determine the rating value to display (hover value takes precedence for preview effect)
  const displayValue = hoverValue !== null ? hoverValue : value;

  // Define size styles for the stars
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };
  
  // Define text size styles for the optional numeric display
  const textSizeStyles = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  // Define color styles for filled and empty stars
  const colorStyles = {
    yellow: {
      filled: 'text-amber-400',
      empty: 'text-gray-200',
      hover: 'text-amber-300',
    },
    blue: {
      filled: 'text-blue-500',
      empty: 'text-gray-200',
      hover: 'text-blue-400',
    },
    pink: {
      filled: 'text-pink-500',
      empty: 'text-gray-200',
      hover: 'text-pink-400',
    },
    purple: {
      filled: 'text-purple-500',
      empty: 'text-gray-200',
      hover: 'text-purple-400',
    },
  };

  const containerStyles = twMerge(
    'inline-flex items-center',
    editable && 'group',
    className
  );

  // Handle clicking on a star when the component is editable
  const handleClick = (newValue: number) => {
    if (editable && onChange) {
      onChange(newValue);
    }
  };
  
  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
    if (!editable || !onChange) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(starValue);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, value - 1));
    }
  };

  return (
    <div className="flex flex-col">
      {label && <span className="text-sm text-gray-600 mb-1">{label}</span>}
      
      <div className={containerStyles}>
        <div 
          className="flex"
          onMouseLeave={() => setHoverValue(null)}
          tabIndex={editable ? 0 : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          role={editable ? "slider" : "img"}
          aria-label={`${value} out of ${max} stars`}
          aria-valuemin={1}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} out of ${max} stars`}
        >
          {[...Array(max)].map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= displayValue;
            
            return (
              <span
                key={index}
                onClick={() => handleClick(starValue)}
                onMouseEnter={() => editable && setHoverValue(starValue)}
                onKeyDown={(e) => handleKeyDown(e, starValue)}
                className={`
                  relative 
                  ${editable ? 'cursor-pointer' : ''}
                  ${index > 0 ? '-ml-px' : ''}
                  transition-colors duration-150
                `}
                tabIndex={editable ? 0 : -1}
                role={editable ? "button" : undefined}
                aria-label={editable ? `Rate ${starValue} out of ${max}` : undefined}
              >
                {/* Star SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`
                    ${sizeStyles[size]} 
                    ${isFilled 
                      ? colorStyles[color].filled 
                      : colorStyles[color].empty}
                    ${editable && 'transition-transform duration-150 group-hover:scale-110'}
                    ${editable && isFocused && starValue === value ? 'ring-2 ring-offset-2 ring-blue-300 rounded-full' : ''}
                  `}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                
                {/* Animated fill effect for partially filled stars */}
                {value > index && value < index + 1 && (
                  <div 
                    className={`absolute inset-0 overflow-hidden pointer-events-none`}
                    style={{ width: `${(value - index) * 100}%` }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${sizeStyles[size]} ${colorStyles[color].filled}`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                )}
              </span>
            );
          })}
        </div>
        
        {/* Optional numeric display */}
        {showValue && (
          <span className={`ml-2 ${textSizeStyles[size]} font-medium text-gray-700`}>
            {value.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Rating;