import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Lightweight CSS Logo Mark */}
      <div 
        className={`${iconSizeClasses[size]} rounded-md bg-[#16365B] border border-[#B9E5FF]/30 flex items-center justify-center shrink-0 shadow-sm`}
        aria-hidden="true"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-4/5 h-4/5 text-[#B9E5FF]" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#B9E5FF" fillOpacity="0.15" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-white ${textSizeClasses[size]}`}>
          Ener<span className="text-[#B9E5FF]">Guru</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider text-slate-300 uppercase">
            Energy Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
