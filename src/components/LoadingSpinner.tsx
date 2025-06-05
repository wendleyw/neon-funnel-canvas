import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Carregando...", 
  size = 'md', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative inline-block">
          {/* Spinner principal */}
          <Loader2 
            className={`${sizeClasses[size]} text-white animate-spin`} 
          />
          {/* Efeito neon */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-cyan-400 rounded-full opacity-20 animate-pulse`}></div>
        </div>
        
        {message && (
          <p className="text-white mt-4 text-sm font-medium animate-pulse">
            {message}
          </p>
        )}
        
        {/* Pontos animados */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
}; 