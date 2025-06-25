import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variants = {
    default: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${variants[variant]} animate-spin`} />
      {text && (
        <span className={`ml-2 ${variants[variant]} font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
