import React from 'react';

const Card = ({ title, children, variant = 'default', className = '' }) => {
  const baseStyles = 'rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden backdrop-blur-lg';
  
  const variants = {
    default: 'bg-white/90 border border-white/20',
    gradient: 'bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/30 border border-white/30',
    dark: 'bg-gray-900/90 border border-gray-700/20 text-white',
    glass: 'bg-white/10 border border-white/20 backdrop-blur-xl',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {/* Gradient overlay for extra visual appeal */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5 rounded-2xl"></div>
      )}
      
      <div className="relative z-10">
        {title && (
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;